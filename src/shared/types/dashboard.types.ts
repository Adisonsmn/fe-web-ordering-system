// Dashboard stats types

export interface DashboardStatsResponse {
  pendapatanHariIni: number;
  totalPesananHariIni: number;
  totalMejaAktif: number;
  avgRatingHariIni: number;
  avgOrderValue: number;
  totalPoinRedeemed: number;
  totalDiskonPromo: number;
  liveOrders: import('./pesanan.types').PesananResponse[];
}

export interface MetrikDelta {
  nilaiHariIni: number | null;
  nilaiKemarin: number | null;
  deltaPersen: number | null;
  deltaArah: 'naik' | 'turun' | 'sama' | 'no_data';
}

export interface DashboardDeltaResponse {
  pendapatan: MetrikDelta;
  totalPesanan: MetrikDelta;
  mejaAktif: MetrikDelta;
  ratingRata: MetrikDelta;
}

export interface PendapatanTrendResponse {
  label: string;
  totalPendapatan: number;
  totalPesanan: number;
}

export interface MenuTerlarisResponse {
  menuId: string;
  menuName: string;
  totalTerjual: number;
  totalPendapatan: number;
}

export interface PesananBaruWsPayload {
  pesananId: string;
  kodePesanan: string;
  nomorMeja: number | null;
  zone: string | null;
  total: number;
  jumlahItem: number;
  createdAt: string;
}

export type ActivityType = 'ORDER' | 'PAYMENT' | 'RATING' | 'SYSTEM';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}
