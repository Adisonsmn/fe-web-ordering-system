import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { keranjangKeys } from '../../keranjang/hooks/useKeranjang';
import { useKeranjangStore } from '../../keranjang/store/keranjangStore';
import { createPesanan, getPesananDetail } from '../api/pesanan.api';

export const pesananKeys = {
  all: ['pesanan'] as const,
  detail: (id: string) => [...pesananKeys.all, 'detail', id] as const,
};

export const useBuatPesanan = () => {
  const queryClient = useQueryClient();
  const resetKeranjang = useKeranjangStore((state) => state.reset);

  return useMutation({
    mutationFn: createPesanan,
    onSuccess: () => {
      // Invalidate keranjang (kosong setelah dipesan)
      queryClient.invalidateQueries({ queryKey: keranjangKeys.all });
      // Reset state keranjang lokal
      resetKeranjang();
    },
    onError: (error: any) => {
      console.error('Gagal membuat pesanan:', error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Gagal membuat pesanan. Silakan coba lagi.',
      );
    },
  });
};

export const usePesananDetail = (pesananId: string) => {
  return useQuery({
    queryKey: pesananKeys.detail(pesananId),
    queryFn: () => getPesananDetail(pesananId),
    enabled: !!pesananId,
    // Data pesanan sering di-update dari dashboard/kitchen, tapi untuk customer view kita bisa pakai websocket nanti
    // Untuk saat ini kita polling atau biarkan default stale time
  });
};
