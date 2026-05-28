import { apiClient } from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { StrukPesananResponse } from '@shared/types/pesanan.types';

export const getStruk = async (pesananId: string): Promise<StrukPesananResponse> => {
  const data = await apiClient.get<unknown, StrukPesananResponse>(`/pesanan/${pesananId}/struk`);
  return data;
};
