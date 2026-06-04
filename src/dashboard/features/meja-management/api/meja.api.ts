import { apiClient } from '@shared/lib/axios';
import type { CreateMejaRequest, MejaResponse } from '@shared/types';

export const getAllMeja = async (): Promise<MejaResponse[]> => {
  const data = await apiClient.get<unknown, MejaResponse[]>('/meja');
  return data;
};

export const createMeja = async (request: CreateMejaRequest): Promise<MejaResponse> => {
  const data = await apiClient.post<unknown, MejaResponse>('/meja', request);
  return data;
};

export const deleteMeja = async (mejaId: string): Promise<void> => {
  await apiClient.delete(`/meja/${mejaId}`);
};

export const updateMejaStatus = async (params: {
  mejaId: string;
  isOccupied: boolean;
}): Promise<MejaResponse> => {
  const data = await apiClient.patch<unknown, MejaResponse>(`/meja/${params.mejaId}/status`, {
    isOccupied: params.isOccupied,
  });
  return data;
};

export const downloadQrCode = async (mejaId: string): Promise<Blob> => {
  // Using native fetch because axios might have issues with blobs sometimes,
  // but we can use apiClient if we configure it correctly.
  // Actually, we can just use apiClient with responseType: 'blob'
  const response = await apiClient.get(`/meja/${mejaId}/qr`, {
    responseType: 'blob',
    // We need to bypass the default unwrap if the unwrap strictly expects JSON,
    // but our apiClient unwraps `data` from AxiosResponse.
  });

  // Since apiClient is configured to return `response.data` in the interceptor,
  // `response` here is already the Blob data (or the un-wrapped response).
  return response as unknown as Blob;
};
