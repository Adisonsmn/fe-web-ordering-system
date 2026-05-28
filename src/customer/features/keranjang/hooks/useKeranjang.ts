import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addKeranjangItem, getKeranjang } from '../api/keranjang.api';

export const keranjangKeys = {
  all: ['keranjang'] as const,
  detail: () => [...keranjangKeys.all, 'detail'] as const,
};

import { useAuthStore } from '@shared/stores/authStore';

export const useKeranjang = () => {
  const token = useAuthStore((state) => state.token);
  
  return useQuery({
    queryKey: keranjangKeys.detail(),
    queryFn: getKeranjang,
    // Jangan cache terlalu lama karena bisa di-update
    staleTime: 1000 * 30, // 30 detik
    enabled: !!token, // HANYA fetch keranjang ke API jika user sudah punya token
  });
};

export const useTambahItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addKeranjangItem,
    onSuccess: () => {
      // Invalidate cache keranjang setelah berhasil tambah item
      queryClient.invalidateQueries({ queryKey: keranjangKeys.all });
    },
    onError: (error) => {
      console.error('Gagal tambah item ke keranjang:', error);
      // Di sini idealnya panggil toast notification kalau ada toast global
    },
  });
};
