import { apiClient } from '@shared/lib/axios';
import type { AddKeranjangItemRequest, KeranjangResponse } from '@shared/types';

export const getKeranjang = async (): Promise<KeranjangResponse> => {
  const data = await apiClient.get<unknown, KeranjangResponse>('/keranjang');
  return data;
};

export const addKeranjangItem = async (
  payload: AddKeranjangItemRequest,
): Promise<KeranjangResponse> => {
  const data = await apiClient.post<unknown, KeranjangResponse>('/keranjang/items', payload);
  return data;
};
