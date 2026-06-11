import { apiClient } from '@shared/lib/axios';
import type {
  CreatePromoRequest,
  PageResponse,
  PromoHistoryResponse,
  PromoResponse,
} from '@shared/types';

export const getPromoList = async (status?: string): Promise<PromoResponse[]> => {
  let mappedStatus = status;
  if (status === 'aktif') mappedStatus = 'active';
  else if (status === 'terjadwal') mappedStatus = 'scheduled';
  else if (status === 'selesai') mappedStatus = 'ended';

  const data = await apiClient.get<unknown, PromoResponse[]>('/promo/admin', {
    params: mappedStatus && mappedStatus !== 'semua' ? { status: mappedStatus } : undefined,
  });
  return data;
};

export const getPromoHistory = async (
  promoId: string,
  page = 0,
  size = 10,
): Promise<PageResponse<PromoHistoryResponse>> => {
  const data = await apiClient.get<unknown, PageResponse<PromoHistoryResponse>>(
    `/promo/${promoId}/history`,
    {
      params: { page, size },
    },
  );
  return data;
};

export const createPromo = async (request: CreatePromoRequest): Promise<PromoResponse> => {
  const data = await apiClient.post<unknown, PromoResponse>('/promo', request);
  return data;
};

export const updatePromo = async ({
  promoId,
  request,
}: {
  promoId: string;
  request: CreatePromoRequest;
}): Promise<PromoResponse> => {
  const data = await apiClient.put<unknown, PromoResponse>(`/promo/${promoId}`, request);
  return data;
};

export const deletePromo = async (promoId: string): Promise<void> => {
  await apiClient.delete(`/promo/${promoId}`);
};
