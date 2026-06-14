import { useNotificationSound } from '@shared/hooks/useNotificationSound';
import { useWebSocket } from '@shared/hooks/useWebSocket';
import type { MejaStatusWsPayload, PesananBaruWsPayload } from '@shared/types';
import { useCallback, useEffect, useState } from 'react';
import type { ToastItem, ToastType } from '../components/DashboardToast';

// Shape payload dashboard-stats yang relevan untuk notifikasi rating
interface RatingWsPayload {
  event?: string;
  pesananId?: string;
  kodePesanan?: string;
  nomorMeja?: number | null;
  bintang?: number;
  namaClient?: string | null;
  isGuest?: boolean;
}

const MAX_HISTORY = 5;

/**
 * Hook terpusat untuk semua notifikasi admin dashboard.
 * Dipasang SEKALI di DashboardApp sehingga aktif di semua halaman.
 *
 * Mengelola DUA state:
 * - liveToasts : pop-up sementara yang auto-dismiss (tampil di kanan atas)
 * - history    : 5 notifikasi terakhir yang tersimpan untuk panel lonceng
 *
 * Subscribe ke:
 * - /topic/admin/pesanan-baru    → suara 'order' + toast
 * - /topic/admin/meja-status     → suara 'table' + toast (hanya saat OCCUPIED)
 * - /topic/admin/dashboard-stats → suara 'rating' + toast (hanya event RATING_SUBMITTED)
 */
export const useAdminNotifications = () => {
  const { subscribe } = useWebSocket();
  const { play } = useNotificationSound();

  // Pop-up sementara (auto-dismiss via DashboardToast)
  const [liveToasts, setLiveToasts] = useState<ToastItem[]>([]);

  // Riwayat 5 terakhir untuk panel lonceng (tidak auto-dismiss)
  const [history, setHistory] = useState<ToastItem[]>([]);

  // Jumlah notif yang belum dibaca (reset saat panel dibuka)
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback(
    (type: ToastType, title: string, description: string) => {
      const id = crypto.randomUUID();
      const item: ToastItem = { id, type, title, description };

      // Tambah ke live toasts (untuk pop-up)
      setLiveToasts((prev) => [...prev, item]);

      // Tambah ke history, batasi maks 5, yang terbaru di atas
      setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY));

      // Tambah unread counter
      setUnreadCount((prev) => prev + 1);
    },
    [],
  );

  const dismissLiveToast = useCallback((id: string) => {
    setLiveToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Dipanggil saat panel lonceng dibuka — reset unread count
  const markAllRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Hapus satu notif dari history
  const dismissFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    // ── 1. Pesanan Baru ──────────────────────────────────────────────────────
    const unsubPesanan = subscribe(
      '/topic/admin/pesanan-baru',
      (payload: PesananBaruWsPayload) => {
        play('order');
        const lokasiText = payload.nomorMeja ? `Meja ${payload.nomorMeja}` : 'Takeaway';
        addNotification(
          'order',
          `Pesanan Baru Masuk! 🛎️`,
          `${lokasiText} · ${payload.jumlahItem} item · ${payload.kodePesanan}`,
        );
      },
    );

    // ── 2. Meja Terscan / Terisi ─────────────────────────────────────────────
    const unsubMeja = subscribe(
      '/topic/admin/meja-status',
      (payload: MejaStatusWsPayload) => {
        if (payload.isOccupied) {
          play('table');
          addNotification(
            'table',
            `Meja ${payload.nomorMeja} Terscan`,
            `Pelanggan baru telah memindai QR Meja ${payload.nomorMeja}`,
          );
        }
      },
    );

    // ── 3. Rating / Ulasan Masuk ─────────────────────────────────────────────
    const unsubStats = subscribe(
      '/topic/admin/dashboard-stats',
      (payload: RatingWsPayload) => {
        if (payload.event !== 'RATING_SUBMITTED') return;

        play('rating');
        const bintang = payload.bintang ?? 0;
        const stars = '⭐'.repeat(Math.min(bintang, 5));

        let pengirim: string;
        if (payload.isGuest || !payload.namaClient) {
          pengirim = payload.nomorMeja ? `Tamu Meja ${payload.nomorMeja}` : 'Tamu';
        } else {
          pengirim = payload.namaClient;
        }

        addNotification('rating', `Ulasan Baru ${stars}`, `${pengirim} memberikan rating ${bintang}/5`);
      },
    );

    return () => {
      unsubPesanan();
      unsubMeja();
      unsubStats();
    };
  }, [subscribe, play, addNotification]);

  return {
    liveToasts,
    dismissLiveToast,
    history,
    dismissFromHistory,
    unreadCount,
    markAllRead,
  };
};
