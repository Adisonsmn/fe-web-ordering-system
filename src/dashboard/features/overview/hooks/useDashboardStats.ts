import { mejaKeys } from '@dashboard/features/meja-management/hooks/useMejaManagement';
import { useWebSocket } from '@shared/hooks/useWebSocket';
import type { MejaResponse, MejaStatusWsPayload, PesananBaruWsPayload } from '@shared/types';
import { formatJam } from '@shared/utils/date';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getAllMeja,
  getDashboardDelta,
  getDashboardStats,
  getMenuTerlaris,
  getPendapatanTrend,
} from '../api/dashboard.api';
import { useActivityStore } from '../store/activityStore';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  trend: (params?: object) => [...dashboardKeys.all, 'trend', params] as const,
  topMenu: (params?: object) => [...dashboardKeys.all, 'topMenu', params] as const,
};

// Payload shape dari backend untuk event dashboard-stats WS
interface DashboardStatsWsPayload {
  event?: string;
  pesananId?: string;
  kodePesanan?: string;
  nomorMeja?: number | null;
  status?: string;
  estimasiMenit?: number | null;
  totalHarga?: number;
  bintang?: number;
}

export const useDashboardStats = () => {
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();
  const addActivity = useActivityStore((state) => state.addActivity);

  const query = useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
  });

  useEffect(() => {
    // Subscribe to new orders
    const unsubPesananBaru = subscribe(
      '/topic/admin/pesanan-baru',
      (payload: PesananBaruWsPayload) => {
        // Refetch stats untuk update live orders & KPIs
        // Meja status dihandle oleh WS /topic/admin/meja-status secara optimistik
        queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });

        // Add to activity feed
        addActivity({
          id: crypto.randomUUID(),
          type: 'ORDER',
          title: `Pesanan Baru (${payload.kodePesanan})`,
          description: `Masuk dari ${
            payload.nomorMeja ? `Meja ${payload.nomorMeja}` : 'Takeaway'
          } dengan ${payload.jumlahItem} item`,
          timestamp: formatJam(new Date().toISOString()),
        });
      },
    );

    // Subscribe ke event update status pesanan, bayar, cancel, dan rating
    const unsubDashboardStats = subscribe(
      '/topic/admin/dashboard-stats',
      (payload: DashboardStatsWsPayload) => {
        // Selalu invalidate stats agar KPI update
        queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });

        // Buat entri aktivitas sesuai jenis event
        const now = formatJam(new Date().toISOString());
        const mejaInfo = payload.nomorMeja ? `Meja ${payload.nomorMeja}` : 'Takeaway';

        if (payload.event === 'PESANAN_STATUS_UPDATED') {
          const statusLabels: Record<string, string> = {
            PREPARING: 'sedang diproses dapur',
            READY: 'siap disajikan',
            SERVED: 'telah diantarkan',
            CONFIRMED: 'dikonfirmasi',
            CANCELLED: 'dibatalkan',
          };
          const label = payload.status ? (statusLabels[payload.status] ?? payload.status) : '-';
          addActivity({
            id: crypto.randomUUID(),
            type: payload.status === 'CANCELLED' ? 'SYSTEM' : 'ORDER',
            title: `Pesanan ${payload.kodePesanan ?? ''} ${label}`,
            description: `${mejaInfo}${payload.estimasiMenit ? ` · Estimasi ${payload.estimasiMenit} menit` : ''}`,
            timestamp: now,
          });
        } else if (payload.event === 'PESANAN_SERVED') {
          addActivity({
            id: crypto.randomUUID(),
            type: 'PAYMENT',
            title: `Pesanan ${payload.kodePesanan ?? ''} selesai`,
            description: `${mejaInfo} — pembayaran telah dicatat`,
            timestamp: now,
          });
        } else if (payload.event === 'PESANAN_CANCELLED') {
          addActivity({
            id: crypto.randomUUID(),
            type: 'SYSTEM',
            title: `Pesanan ${payload.kodePesanan ?? ''} dibatalkan`,
            description: mejaInfo,
            timestamp: now,
          });
        } else if (payload.event === 'RATING_SUBMITTED') {
          const bintang = payload.bintang ?? 0;
          const stars = '⭐'.repeat(Math.min(bintang, 5));
          addActivity({
            id: crypto.randomUUID(),
            type: 'RATING',
            title: `Ulasan baru dari ${mejaInfo}`,
            description: `Rating ${bintang}/5  ${stars}  (Pesanan ${payload.kodePesanan ?? ''})`,
            timestamp: now,
          });
        }
        // Jika event tidak dikenal, cukup invalidate stats saja (sudah dilakukan di atas)
      },
    );

    return () => {
      unsubPesananBaru();
      unsubDashboardStats();
    };
  }, [queryClient, subscribe, addActivity]);

  return query;
};

export const useDashboardDelta = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return useQuery({
    queryKey: [...dashboardKeys.all, 'delta', today],
    queryFn: () => getDashboardDelta(today),
  });
};

export const usePendapatanTrend = (params?: {
  period?: string;
  bulan?: number;
  tahun?: number;
}) => {
  return useQuery({
    queryKey: dashboardKeys.trend(params),
    queryFn: () => getPendapatanTrend(params),
  });
};

export const useMenuTerlaris = (params?: {
  period?: string;
  category?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: dashboardKeys.topMenu(params),
    queryFn: () => getMenuTerlaris(params),
  });
};

export const useMejaList = () => {
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();
  const addActivity = useActivityStore((state) => state.addActivity);

  const query = useQuery({
    queryKey: mejaKeys.list(),
    queryFn: getAllMeja,
  });

  useEffect(() => {
    const unsubMejaStatus = subscribe(
      '/topic/admin/meja-status',
      (payload: MejaStatusWsPayload) => {
        // Optimitic update cache
        queryClient.setQueryData<MejaResponse[]>(mejaKeys.list(), (old) => {
          if (!old) return old;
          return old.map((m) =>
            m.mejaId === payload.mejaId
              ? { ...m, isOccupied: payload.isOccupied, mejaStatus: payload.status }
              : m,
          );
        });

        // Invalidate dashboard stats agar KPI "Okupansi Meja" tetap sinkron
        queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });

        // Add to activity feed
        addActivity({
          id: crypto.randomUUID(),
          type: payload.isOccupied ? 'ORDER' : 'SYSTEM',
          title: `Meja ${payload.nomorMeja} ${payload.isOccupied ? 'terisi' : 'kosong'}`,
          description: payload.isOccupied
            ? `Meja ${payload.nomorMeja} mulai digunakan tamu`
            : `Meja ${payload.nomorMeja} telah dikosongkan`,
          timestamp: formatJam(new Date().toISOString()),
        });
      },
    );

    return () => {
      unsubMejaStatus();
    };
  }, [queryClient, subscribe, addActivity]);

  return query;
};
