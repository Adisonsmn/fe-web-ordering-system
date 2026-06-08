import { apiClient } from '@shared/lib/axios';
import type {
  PoinBalanceResponse,
  PoinKalkulasiRequest,
  PoinKalkulasiResponse,
  PoinEstimasiResponse,
} from '@shared/types';

export const getPoinBalance = async (): Promise<PoinBalanceResponse> => {
  const data = await apiClient.get<unknown, PoinBalanceResponse>('/poin');
  return data;
};

export const getEstimasiPoin = async (subtotal: number): Promise<PoinEstimasiResponse> => {
  const data = await apiClient.get<unknown, PoinEstimasiResponse>('/poin/estimasi', {
    params: { subtotal },
  });
  return data;
};

export const kalkulasiPoin = async (
  payload: PoinKalkulasiRequest,
): Promise<PoinKalkulasiResponse> => {
  const data = await apiClient.post<unknown, PoinKalkulasiResponse>('/poin/kalkulasi', payload);
  return data;
};
