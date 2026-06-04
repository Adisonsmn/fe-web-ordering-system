export type StatusPesanan =
  | 'NEW'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'PAID'
  | 'CANCELLED';

export type MetodePembayaran = 'CASH' | 'QRIS' | 'DEBIT' | 'CREDIT_CARD';

export interface DetailPesananResponse {
  detailPesananId: string;
  menuId: string;
  menuName: string;
  imageUrl: string | null;
  quantity: number;
  catatan: string | null;
  hargaSnapshot: number;
  hargaSetelahDiskon: number;
  subTotal: number;
}

export interface PesananResponse {
  pesananId: string;
  kodePesanan: string;
  tanggalPesanan: string;
  isServed: boolean;
  totalHarga: number;
  jumlahDibayar: number;
  status: StatusPesanan;
  catatanDapur: string | null;
  estimasiMenit: number | null;
  metodePembayaran: MetodePembayaran | null;
  poinDigunakan: number | null;
  potonganPoin: number | null;
  nomorMeja: number | null;
  mejaId: string | null;
  clientId: string;
  detailPesanan: DetailPesananResponse[];
}

export interface CreatePesananRequest {
  mejaId: string;
  catatanDapur?: string;
  gunakanPoin: boolean;
}

export interface UpdateStatusPesananRequest {
  status: StatusPesanan;
  estimasiMenit?: number;
}

export interface PoinBalanceResponse {
  totalPoint: number;
  rupiahPerPoin: number;
}

export interface PoinKalkulasiRequest {
  pesananSubtotal: number;
  poinDigunakan: number;
}

export interface PoinKalkulasiResponse {
  diskonRupiah: number;
  totalSetelahDiskon: number;
}

export interface StrukItem {
  menuName: string;
  quantity: number;
  hargaSetelahDiskon: number;
  subTotal: number;
}

export interface StrukPesananResponse {
  pesananId: string;
  kodePesanan: string;
  tanggalPesanan: string;
  nomorMeja: number | null;
  metodePembayaran: MetodePembayaran | null;
  subtotal: number;
  diskonPoin: number;
  diskonPromo: number;
  totalAkhir: number;
  items: StrukItem[];
}
