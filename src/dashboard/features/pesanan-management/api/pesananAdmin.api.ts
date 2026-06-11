import { apiClient } from '@shared/lib/axios';
import type { PesananResponse } from '@shared/types';
import type { StatusPesanan, UpdateStatusPesananRequest } from '@shared/types/pesanan.types';

export interface KanbanPesananResponse {
  newOrders: PesananResponse[];
  preparingOrders: PesananResponse[];
  readyOrders: PesananResponse[];
}

export const getKanbanPesanan = async (): Promise<KanbanPesananResponse> => {
  const data = await apiClient.get<unknown, KanbanPesananResponse>('/pesanan/kanban');
  return data;
};

export const updateStatusPesanan = async ({
  pesananId,
  status,
  estimasiMenit,
}: {
  pesananId: string;
  status: StatusPesanan;
  estimasiMenit?: number;
}): Promise<PesananResponse> => {
  const request: UpdateStatusPesananRequest = { status, estimasiMenit };
  const data = await apiClient.patch<unknown, PesananResponse>(
    `/pesanan/${pesananId}/status`,
    request,
  );
  return data;
};

export const selesaikanPesanan = async (pesananId: string): Promise<PesananResponse> => {
  const data = await apiClient.patch<unknown, PesananResponse>(`/pesanan/${pesananId}/status`, {
    status: 'SERVED',
  });
  return data;
};

export interface RiwayatPesananParams {
  startDate?: string; // ISO date-time
  endDate?: string; // ISO date-time
  category?: string;
  page?: number;
  size?: number;
}

export const getRiwayatPesananAdmin = async (
  params?: RiwayatPesananParams,
): Promise<import('@shared/types/api.types').PageResponse<PesananResponse>> => {
  const data = await apiClient.get<
    unknown,
    import('@shared/types/api.types').PageResponse<PesananResponse>
  >('/pesanan', { params });
  return data;
};

