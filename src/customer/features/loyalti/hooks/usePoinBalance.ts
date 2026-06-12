import { useQuery } from '@tanstack/react-query';
import { getPoinBalance } from '../api/poin.api';

export const poinKeys = {
  balance: ['poin', 'balance'] as const,
  riwayat: (page: number) => ['poin', 'riwayat', page] as const,
};

export const usePoinBalance = () => {
  return useQuery({
    queryKey: poinKeys.balance,
    queryFn: getPoinBalance,
    staleTime: 1000 * 60 * 2, // 2 menit — saldo bisa berubah setelah pesanan
    retry: 1,
  });
};
