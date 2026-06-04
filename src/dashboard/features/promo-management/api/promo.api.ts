import { apiClient } from '@shared/lib/axios';
import type { ApiResponse, CreatePromoRequest, PromoResponse } from '@shared/types';

export const getPromoList = async (status?: string): Promise<PromoResponse[]> => {
  const { data } = await apiClient.get<ApiResponse<PromoResponse[]>>('/promo/admin', {
    params: status && status !== 'semua' ? { status } : undefined,
  });
  return data.data;
};

export const createPromo = async (request: CreatePromoRequest): Promise<PromoResponse> => {
  const { data } = await apiClient.post<ApiResponse<PromoResponse>>('/promo', request);
  return data.data;
};

export const updatePromo = async ({
  promoId,
  request,
}: {
  promoId: string;
  request: CreatePromoRequest;
}): Promise<PromoResponse> => {
  const { data } = await apiClient.put<ApiResponse<PromoResponse>>(`/promo/${promoId}`, request);
  return data.data;
};

export const deletePromo = async (promoId: string): Promise<void> => {
  await apiClient.delete(`/promo/${promoId}`);
};
