import { apiClient } from '@shared/lib/axios';
import type { ScanMejaResponse } from '@shared/types/meja.types';

export const scanMeja = async (mejaId: string): Promise<ScanMejaResponse> => {
  const data = await apiClient.get<unknown, ScanMejaResponse>(`/meja/scan/${mejaId}`);
  return data;
};
