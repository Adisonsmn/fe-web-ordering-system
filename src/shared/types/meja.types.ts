export interface ScanMejaResponse {
  mejaId: string;
  nomorMeja: number;
  zone: string;
  isActive: boolean;
  isOccupied: boolean;
  isOpen: boolean;
  sessionToken?: string;
}

export interface MejaResponse {
  mejaId: string;
  nomorMeja: number;
  zone: string;
  isActive: boolean;
  isOccupied: boolean;
  qrCodeUrl: string;
  mejaStatus?: 'AVAILABLE' | 'OCCUPIED';
}

export interface CreateMejaRequest {
  nomorMeja: number;
  zone: 'INDOOR' | 'OUTDOOR';
}

export interface MejaStatusWsPayload {
  mejaId: string;
  nomorMeja: number;
  isOccupied: boolean;
  status?: 'AVAILABLE' | 'OCCUPIED';
}
