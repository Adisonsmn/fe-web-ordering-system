import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addKeranjangItem,
  clearKeranjang,
  getKeranjang,
  removeKeranjangItem,
  updateKeranjangItem,
} from '../api/keranjang.api';

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
    select: (data) => {
      // Fix bug: sort items alphabetically by menuName so their positions don't change on update
      const sortedItems = [...data.items].sort((a, b) => a.menuName.localeCompare(b.menuName));
      return { ...data, items: sortedItems };
    },
  });
};

export const useTambahItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addKeranjangItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keranjangKeys.all });
    },
    onError: (error: any) => {
      console.error('Gagal tambah item ke keranjang:', error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        alert(
          'Sesi tidak valid. Silakan mulai ulang dari awal (Welcome) atau Login untuk memindai meja.',
        );
      } else {
        alert('Gagal menambahkan item ke keranjang. Silakan coba lagi.');
      }
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      detailId,
      payload,
    }: {
      detailId: string;
      payload: import('@shared/types').UpdateKeranjangItemRequest;
    }) => updateKeranjangItem(detailId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keranjangKeys.all });
    },
    onError: (error) => {
      console.error('Gagal update item keranjang:', error);
    },
  });
};

export const useRemoveItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeKeranjangItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keranjangKeys.all });
    },
    onError: (error) => {
      console.error('Gagal hapus item keranjang:', error);
    },
  });
};

export const useClearKeranjang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearKeranjang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keranjangKeys.all });
    },
    onError: (error) => {
      console.error('Gagal mengosongkan keranjang:', error);
    },
  });
};
