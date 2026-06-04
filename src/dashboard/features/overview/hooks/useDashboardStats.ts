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
  meja: () => [...dashboardKeys.all, 'meja'] as const,
};

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
        // Refetch stats to get updated live orders & KPIs
        queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.meja() });

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

    // Subscribe to generic dashboard stats update
    const unsubDashboardStats = subscribe('/topic/admin/dashboard-stats', () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    });

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
    queryKey: dashboardKeys.meja(),
    queryFn: getAllMeja,
  });

  useEffect(() => {
    const unsubMejaStatus = subscribe(
      '/topic/admin/meja-status',
      (payload: MejaStatusWsPayload) => {
        // Optimitic update cache
        queryClient.setQueryData<MejaResponse[]>(dashboardKeys.meja(), (old) => {
          if (!old) return old;
          return old.map((m) =>
            m.mejaId === payload.mejaId ? { ...m, isOccupied: payload.isOccupied } : m,
          );
        });

        // Add to activity feed
        addActivity({
          id: crypto.randomUUID(),
          type: payload.isOccupied ? 'SYSTEM' : 'PAYMENT',
          title: `Status Meja ${payload.nomorMeja}`,
          description: payload.isOccupied ? 'Meja mulai digunakan tamu' : 'Meja kosong/selesai',
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
