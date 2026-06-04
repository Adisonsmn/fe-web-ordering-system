export interface ScanMejaResponse {
  mejaId: string;
  nomorMeja: number;
  zone: string;
  isActive: boolean;
  isOccupied: boolean;
  isOpen: boolean;
}

export interface MejaResponse {
  mejaId: string;
  nomorMeja: number;
  zone: string;
  isActive: boolean;
  isOccupied: boolean;
  qrCodeUrl: string;
}

export interface CreateMejaRequest {
  nomorMeja: number;
  zone: 'INDOOR' | 'OUTDOOR';
}

export interface MejaStatusWsPayload {
  mejaId: string;
  nomorMeja: number;
  isOccupied: boolean;
}
