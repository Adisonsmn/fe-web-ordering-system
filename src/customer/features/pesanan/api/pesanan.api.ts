import { apiClient } from '@shared/lib/axios';
import type { CreatePesananRequest, PesananResponse } from '@shared/types';

export const createPesanan = async (payload: CreatePesananRequest): Promise<PesananResponse> => {
  const data = await apiClient.post<unknown, PesananResponse>('/pesanan', payload);
  return data;
};

export const getPesananDetail = async (pesananId: string): Promise<PesananResponse> => {
  const data = await apiClient.get<unknown, PesananResponse>(`/pesanan/${pesananId}`);
  return data;
};
