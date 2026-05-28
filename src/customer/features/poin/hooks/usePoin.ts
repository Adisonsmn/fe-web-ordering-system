import { useAuthStore } from '@shared/stores/authStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getPoinBalance, kalkulasiPoin } from '../api/poin.api';

export const poinKeys = {
  all: ['poin'] as const,
  balance: () => [...poinKeys.all, 'balance'] as const,
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

export const useKalkulasiPoin = () => {
  return useMutation({
    mutationFn: kalkulasiPoin,
  });
};
