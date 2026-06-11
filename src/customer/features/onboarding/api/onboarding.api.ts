import { apiClient } from '@shared/lib/axios';
import type { ScanMejaResponse } from '@shared/types/meja.types';

export const scanMeja = async (mejaId: string): Promise<ScanMejaResponse> => {
  let deviceToken = localStorage.getItem('deviceToken');
  if (!deviceToken) {
    deviceToken =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'fallback-' + Date.now() + '-' + Math.random().toString(36).substring(2);
    localStorage.setItem('deviceToken', deviceToken);
  }
  const data = await apiClient.post<unknown, ScanMejaResponse>(`/meja/scan/${mejaId}`, {
    deviceToken,
  });
  return data;
};
