import { apiClient } from '@shared/lib/axios';
import type {
  PoinBalanceResponse,
  PoinKalkulasiRequest,
  PoinKalkulasiResponse,
} from '@shared/types';

export const getPoinBalance = async (): Promise<PoinBalanceResponse> => {
  const data = await apiClient.get<unknown, PoinBalanceResponse>('/poin');
  return data;
};

export const kalkulasiPoin = async (
  payload: PoinKalkulasiRequest,
): Promise<PoinKalkulasiResponse> => {
  const data = await apiClient.post<unknown, PoinKalkulasiResponse>('/poin/kalkulasi', payload);
  return data;
};
