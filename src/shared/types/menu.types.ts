export interface PromoMinResponse {
  promoId: string;
  namaPromo: string;
  tipeDiskon: 'NOMINAL' | 'PERSEN';
  nilaiDiskon: number;
}

export interface MenuResponse {
  menuId: string;
  menuName: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
  imageUrl: string | null;
  promo: PromoMinResponse | null;
}

export interface PromoResponse {
  promoId: string;
  namaPromo: string;
  tipeDiskon: 'NOMINAL' | 'PERSEN';
  nilaiDiskon: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  targetCategory: string | null;
  isActive: boolean;
  imageUrl: string | null;
  tag: string | null;
  description: string | null;
}
