import { apiClient } from '@shared/lib/axios';
import type {
  DashboardDeltaResponse,
  DashboardStatsResponse,
  MenuTerlarisResponse,
  PendapatanTrendResponse,
  PoinPromoStatsResponse,
  RatingSentimenResponse,
} from '@shared/types';

export const getLaporanDashboard = async (): Promise<DashboardStatsResponse> => {
  const data = await apiClient.get<unknown, DashboardStatsResponse>('/laporan/dashboard');
  return data;
};

export const getLaporanDelta = async (tanggal: string): Promise<DashboardDeltaResponse> => {
  const data = await apiClient.get<unknown, DashboardDeltaResponse>('/laporan/dashboard/delta', {
    params: { tanggal },
  });
  return data;
};

export const getPendapatanTrend = async (
  period = 'bulanan',
  bulan?: number,
  tahun?: number,
): Promise<PendapatanTrendResponse[]> => {
  const data = await apiClient.get<unknown, PendapatanTrendResponse[]>('/laporan/pendapatan', {
    params: { period, bulan, tahun },
  });
  return data;
};

export const getMenuTerlaris = async (
  period = 'bulanan',
  category?: string,
  limit = 10,
): Promise<MenuTerlarisResponse[]> => {
  const data = await apiClient.get<unknown, MenuTerlarisResponse[]>('/laporan/menu-terlaris', {
    params: { period, category, limit },
  });
  return data;
};

export const getRatingSentimen = async (): Promise<RatingSentimenResponse[]> => {
  const data = await apiClient.get<unknown, RatingSentimenResponse[]>('/laporan/rating-sentimen');
  return data;
};

export const getPoinPromoStats = async (): Promise<PoinPromoStatsResponse> => {
  const data = await apiClient.get<unknown, PoinPromoStatsResponse>('/laporan/poin-promo');
  return data;
};

export const exportLaporan = async (period = 'bulanan', format = 'xlsx'): Promise<Blob> => {
  // Blob response — JANGAN diubah, karena response-nya bukan ApiResponse<T>
  const response = await apiClient.get('/laporan/export', {
    params: { period, format },
    responseType: 'blob',
  });
  return response.data;
};
