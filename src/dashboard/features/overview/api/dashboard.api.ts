import { apiClient } from '@shared/lib/axios';
import type {
  DashboardStatsResponse,
  MejaResponse,
  MenuTerlarisResponse,
  PendapatanTrendResponse,
} from '@shared/types';

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const data = await apiClient.get<unknown, DashboardStatsResponse>('/laporan/dashboard');
  return data;
};

export const getDashboardDelta = async (
  tanggal: string,
): Promise<import('@shared/types').DashboardDeltaResponse> => {
  const data = await apiClient.get<unknown, import('@shared/types').DashboardDeltaResponse>(
    '/laporan/dashboard/delta',
    {
      params: { tanggal },
    },
  );
  return data;
};

export const getPendapatanTrend = async (params?: {
  period?: string;
  bulan?: number;
  tahun?: number;
}): Promise<PendapatanTrendResponse[]> => {
  const data = await apiClient.get<unknown, PendapatanTrendResponse[]>('/laporan/pendapatan', {
    params,
  });
  return data;
};

export const getMenuTerlaris = async (params?: {
  period?: string;
  category?: string;
  limit?: number;
}): Promise<MenuTerlarisResponse[]> => {
  const data = await apiClient.get<unknown, MenuTerlarisResponse[]>('/laporan/menu-terlaris', {
    params,
  });
  return data;
};

export const getAllMeja = async (): Promise<MejaResponse[]> => {
  const data = await apiClient.get<unknown, MejaResponse[]>('/meja');
  return data;
};
