import { useQuery } from '@tanstack/react-query';
import { getRiwayatPesananAdmin, type RiwayatPesananParams } from '../api/pesananAdmin.api';

export const riwayatPesananKeys = {
  all: ['riwayat-pesanan-admin'] as const,
  list: (params?: RiwayatPesananParams) => [...riwayatPesananKeys.all, 'list', params] as const,
};

export const useRiwayatPesananAdmin = (params?: RiwayatPesananParams) => {
  return useQuery({
    queryKey: riwayatPesananKeys.list(params),
    queryFn: () => getRiwayatPesananAdmin(params),
  });
};
