export interface DetailKeranjangResponse {
  detailKeranjangId: string;
  menuId: string;
  menuName: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  catatan: string | null;
  subtotal: number;
}

export interface KeranjangResponse {
  keranjangId: string;
  clientId: string;
  sessionId: string;
  items: DetailKeranjangResponse[];
  totalHarga: number;
}

export interface AddKeranjangItemRequest {
  menuId: string;
  quantity: number;
  catatan?: string;
}

export interface UpdateKeranjangItemRequest {
  quantity?: number;
  catatan?: string;
}
