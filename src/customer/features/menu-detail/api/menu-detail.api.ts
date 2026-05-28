import { apiClient } from '@shared/lib/axios';
import type { MenuDetailResponse, MenuResponse } from '@shared/types';

export const getMenuDetail = async (menuId: string): Promise<MenuDetailResponse> => {
  const data = await apiClient.get<unknown, MenuDetailResponse>(`/menu/${menuId}`);
  return data;
};

export const getMenuPairings = async (menuId: string): Promise<MenuResponse[]> => {
  const data = await apiClient.get<unknown, MenuResponse[]>(`/menu/${menuId}/pairings`);
  return data;
};
