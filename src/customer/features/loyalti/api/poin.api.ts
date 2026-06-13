import { apiClient } from '@shared/lib/axios';
import type { PoinBalanceResponse, PoinRiwayatResponse } from '@shared/types';

/** Ambil saldo poin aktif + info member (CLIENT only) */
export const getPoinBalance = async (): Promise<PoinBalanceResponse> => {
  const data = await apiClient.get<unknown, PoinBalanceResponse>('/poin');
  return data;
};

/** Ambil riwayat transaksi poin (paginated) */
export const getPoinRiwayat = async (
  page = 0,
  size = 20,
): Promise<{
  content: PoinRiwayatResponse[];
  totalPages: number;
  totalElements: number;
  page: number;
}> => {
  const data = await apiClient.get<
    unknown,
    {
      content: PoinRiwayatResponse[];
      totalPages: number;
      totalElements: number;
      page: number;
    }
  >('/poin/riwayat', { params: { page, size, sort: 'createdAt,desc' } });
  return data;
};
