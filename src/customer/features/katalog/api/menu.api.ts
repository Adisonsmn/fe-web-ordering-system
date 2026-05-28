import { apiClient } from '@shared/lib/axios';
import type { MenuResponse, PromoResponse } from '@shared/types';

export const getMenuList = async (params?: {
  category?: string;
  search?: string;
  available?: boolean;
}): Promise<MenuResponse[]> => {
  const data = await apiClient.get<unknown, MenuResponse[]>('/menu', { params });
  return data;
};

export const getPromoList = async (): Promise<PromoResponse[]> => {
  const data = await apiClient.get<unknown, PromoResponse[]>('/promo');
  return data;
};
