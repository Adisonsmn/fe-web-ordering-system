import { apiClient } from '@shared/lib/axios';
import type {
  CreateMenuRequest,
  MenuDetailResponse,
  MenuResponse,
  UpdateMenuAvailabilityRequest,
  UpdateMenuRequest,
} from '@shared/types';

export const getMenuListAdmin = async (params?: {
  category?: string;
  search?: string;
  available?: boolean;
}): Promise<MenuResponse[]> => {
  const data = await apiClient.get<unknown, MenuResponse[]>('/menu', { params });
  return data;
};

export const getMenuDetailAdmin = async (menuId: string): Promise<MenuDetailResponse> => {
  const data = await apiClient.get<unknown, MenuDetailResponse>(`/menu/${menuId}`);
  return data;
};

export const createMenu = async (request: CreateMenuRequest): Promise<MenuDetailResponse> => {
  const data = await apiClient.post<unknown, MenuDetailResponse>('/menu', request);
  return data;
};

export const updateMenu = async ({
  menuId,
  request,
}: {
  menuId: string;
  request: UpdateMenuRequest;
}): Promise<MenuDetailResponse> => {
  const data = await apiClient.put<unknown, MenuDetailResponse>(`/menu/${menuId}`, request);
  return data;
};

export const toggleMenuAvailability = async ({
  menuId,
  isAvailable,
}: {
  menuId: string;
  isAvailable: boolean;
}): Promise<MenuDetailResponse> => {
  const request: UpdateMenuAvailabilityRequest = { isAvailable };
  const data = await apiClient.patch<unknown, MenuDetailResponse>(
    `/menu/${menuId}/availability`,
    request,
  );
  return data;
};

export const deleteMenu = async (menuId: string): Promise<void> => {
  await apiClient.delete(`/menu/${menuId}`);
};
