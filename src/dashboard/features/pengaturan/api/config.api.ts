import { apiClient } from '@shared/lib/axios';

export interface RestoConfigResponse {
  isOpen: boolean;
  openTime: string | number[];
  closeTime: string | number[];
  namaRestoran: string;
  tagline: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  instagram?: string;
}

export interface UpdateRestoConfigRequest {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  nama: string;
  tagline: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  instagram?: string;
}

/**
 * Konversi waktu dari berbagai format (array [8,0] atau string "08:00") ke format "HH:mm"
 */
const normalizeTime = (time: string | number[] | undefined | null, fallback: string): string => {
  if (!time) return fallback;
  if (Array.isArray(time)) {
    const hours = String(time[0]).padStart(2, '0');
    const minutes = String(time[1] ?? 0).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  if (typeof time === 'string') return time;
  return fallback;
};

export const getRestoConfigAdmin = async (): Promise<RestoConfigResponse> => {
  const data = await apiClient.get<unknown, RestoConfigResponse>('/config');
  return data;
};

export const updateRestoConfig = async (
  request: UpdateRestoConfigRequest,
): Promise<RestoConfigResponse> => {
  const data = await apiClient.put<unknown, RestoConfigResponse>('/config', request);
  return data;
};

/**
 * Helper: Buat UpdateRestoConfigRequest dari RestoConfigResponse yang ada,
 * hanya override field isOpen. Ini memastikan semua required field tetap terisi.
 */
export const buildToggleRequest = (
  config: RestoConfigResponse,
  newIsOpen: boolean,
): UpdateRestoConfigRequest => {
  return {
    isOpen: newIsOpen,
    openTime: normalizeTime(config.openTime, '08:00'),
    closeTime: normalizeTime(config.closeTime, '22:00'),
    nama: config.namaRestoran || 'Aroma Senja',
    tagline: config.tagline || 'Cita Rasa Nusantara',
    alamat: config.alamat,
    telepon: config.telepon,
    email: config.email,
    instagram: config.instagram,
  };
};
