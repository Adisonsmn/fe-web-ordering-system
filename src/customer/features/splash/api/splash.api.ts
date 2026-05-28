import { apiClient } from '@shared/lib/axios';

export interface RestoConfigResponse {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  namaRestoran: string;
  tagline: string;
  alamat: string;
  telepon: string;
  email: string;
  instagram: string;
}

export const getRestoConfig = async (): Promise<RestoConfigResponse> => {
  const response = (await apiClient.get('/config')) as unknown as RestoConfigResponse;
  return response;
};
