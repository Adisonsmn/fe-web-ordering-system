import { apiClient } from '@shared/lib/axios';
import type { PromoResponse } from '@shared/types';

export const getPromoListAdmin = async (status?: string): Promise<PromoResponse[]> => {
  const params = status ? { status } : undefined;
  const data = await apiClient.get<unknown, PromoResponse[]>('/promo/admin', { params });
  return data;
};
