export type TipeDiskon = 'NOMINAL' | 'PERSEN';

export interface PromoResponse {
  promoId: string;
  namaPromo: string;
  tipeDiskon: TipeDiskon;
  nilaiDiskon: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  targetCategory: string | null;
  isActive: boolean;
  usageCount: number;
  maxUsage: number | null;
  imageUrl: string | null;
  tag: string | null;
  description: string | null;
}

export interface CreatePromoRequest {
  namaPromo: string;
  tipeDiskon: TipeDiskon;
  nilaiDiskon: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  targetCategory?: string;
  maxUsage?: number;
  imageUrl?: string;
  tag?: string;
  description?: string;
}

export interface PromoHistoryResponse {
  pesananId: string;
  kodePesanan: string;
  clientName: string;
  nomorMeja: number | null;
  tanggalPesanan: string;
  totalHarga: number;
  totalPotongan: number;
}
