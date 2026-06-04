export interface PromoMinResponse {
  promoId: string;
  namaPromo: string;
  tipeDiskon: 'NOMINAL' | 'PERSEN';
  nilaiDiskon: number;
}

export interface PromoDetailResponse {
  promoId: string;
  namaPromo: string;
  tipeDiskon: 'NOMINAL' | 'PERSEN';
  nilaiDiskon: number;
  description: string | null;
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

export interface MenuDetailResponse {
  menuId: string;
  menuName: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
  imageUrl: string | null;
  heroImageUrl: string | null;
  titleLine1: string | null;
  titleLine2: string | null;
  longDescription: string | null;
  showDoneness: boolean | null;
  donenessOptions: string[] | null;
  spiceOptions: string[] | null;
  averageRating: number;
  promo: PromoDetailResponse | null;
  createdBy: string | null;
  updatedBy: string | null;
}



export interface CreateMenuRequest {
  menuName: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string | null;
  heroImageUrl: string | null;
  titleLine1: string | null;
  titleLine2: string | null;
  longDescription: string | null;
  showDoneness: boolean;
  donenessOptions: string[] | null;
  spiceOptions: string[] | null;
  promoId: string | null;
}

export interface UpdateMenuRequest extends CreateMenuRequest {}

export interface UpdateMenuAvailabilityRequest {
  isAvailable: boolean;
}
