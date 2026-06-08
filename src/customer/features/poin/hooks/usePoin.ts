import { useAuthStore } from '@shared/stores/authStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getPoinBalance, getEstimasiPoin, kalkulasiPoin } from '../api/poin.api';

export const poinKeys = {
  all: ['poin'] as const,
  balance: () => [...poinKeys.all, 'balance'] as const,
  estimasi: (subtotal: number) => [...poinKeys.all, 'estimasi', subtotal] as const,
};

export const usePoinBalance = () => {
  const { token, isGuest } = useAuthStore();

  return useQuery({
    queryKey: poinKeys.balance(),
    queryFn: getPoinBalance,
    // Hanya enable query jika token ada DAN bukan guest
    enabled: !!token && !isGuest,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

export const useEstimasiPoin = (subtotal: number) => {
  const { token, isGuest } = useAuthStore();

  return useQuery({
    queryKey: poinKeys.estimasi(subtotal),
    queryFn: () => getEstimasiPoin(subtotal),
    enabled: !!token && !isGuest && subtotal > 0,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

export const useKalkulasiPoin = () => {
  return useMutation({
    mutationFn: kalkulasiPoin,
  });
};
