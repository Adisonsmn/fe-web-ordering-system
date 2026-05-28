import { apiClient } from '@shared/lib/axios';
import type {
  AddKeranjangItemRequest,
  KeranjangResponse,
  UpdateKeranjangItemRequest,
} from '@shared/types';

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

export const updateKeranjangItem = async (
  detailId: string,
  payload: UpdateKeranjangItemRequest,
): Promise<KeranjangResponse> => {
  const data = await apiClient.put<unknown, KeranjangResponse>(
    `/keranjang/items/${detailId}`,
    payload,
  );
  return data;
};

export const removeKeranjangItem = async (detailId: string): Promise<KeranjangResponse> => {
  const data = await apiClient.delete<unknown, KeranjangResponse>(`/keranjang/items/${detailId}`);
  return data;
};

export const clearKeranjang = async (): Promise<void> => {
  await apiClient.delete('/keranjang');
};
