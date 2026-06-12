import { useQuery } from '@tanstack/react-query';
import { getPoinRiwayat } from '../api/poin.api';
import { poinKeys } from './usePoinBalance';

export const usePoinRiwayat = (page = 0) => {
  return useQuery({
    queryKey: poinKeys.riwayat(page),
    queryFn: () => getPoinRiwayat(page, 20),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
