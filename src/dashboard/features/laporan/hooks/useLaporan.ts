import { useMutation, useQuery } from '@tanstack/react-query';
import {
  exportLaporan,
  getLaporanDashboard,
  getLaporanDelta,
  getMenuTerlaris,
  getPendapatanTrend,
  getPoinPromoStats,
  getRatingSentimen,
} from '../api/laporan.api';

export const laporanKeys = {
  all: ['laporan'] as const,
  dashboard: () => [...laporanKeys.all, 'dashboard'] as const,
  delta: (tanggal: string) => [...laporanKeys.all, 'delta', tanggal] as const,
  pendapatan: (period: string, bulan?: number, tahun?: number) =>
    [...laporanKeys.all, 'pendapatan', period, bulan, tahun] as const,
  menuTerlaris: (period: string, category?: string, limit?: number) =>
    [...laporanKeys.all, 'menuTerlaris', period, category, limit] as const,
  ratingSentimen: () => [...laporanKeys.all, 'ratingSentimen'] as const,
  poinPromo: () => [...laporanKeys.all, 'poinPromo'] as const,
};

export const useLaporanDashboard = () => {
  return useQuery({
    queryKey: laporanKeys.dashboard(),
    queryFn: getLaporanDashboard,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};

export const useLaporanDelta = (tanggal: string) => {
  return useQuery({
    queryKey: laporanKeys.delta(tanggal),
    queryFn: () => getLaporanDelta(tanggal),
    enabled: !!tanggal,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePendapatanTrend = (period: string, bulan?: number, tahun?: number) => {
  return useQuery({
    queryKey: laporanKeys.pendapatan(period, bulan, tahun),
    queryFn: () => getPendapatanTrend(period, bulan, tahun),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMenuTerlaris = (period: string, category?: string, limit?: number) => {
  return useQuery({
    queryKey: laporanKeys.menuTerlaris(period, category, limit),
    queryFn: () => getMenuTerlaris(period, category, limit),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRatingSentimen = () => {
  return useQuery({
    queryKey: laporanKeys.ratingSentimen(),
    queryFn: getRatingSentimen,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePoinPromoStats = () => {
  return useQuery({
    queryKey: laporanKeys.poinPromo(),
    queryFn: getPoinPromoStats,
    staleTime: 1000 * 60 * 5,
  });
};

export const useExportLaporan = () => {
  return useMutation({
    mutationFn: ({ period, format }: { period: string; format?: string }) =>
      exportLaporan(period, format),
    onSuccess: (data, variables) => {
      // Trigger file download in browser
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-aroma-senja-${variables.period}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
