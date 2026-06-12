import { apiClient } from '@shared/lib/axios';
import type { MenuResponse } from '@shared/types';

/** Ambil menu paling populer (all-time) dari endpoint public GET /api/menu/populer */
export const getMenuPopuler = async (): Promise<MenuResponse | null> => {
  const data = await apiClient.get<unknown, MenuResponse | null>('/menu/populer');
  return data ?? null;
};
