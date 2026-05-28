export interface ItemRatingRequest {
  menuId: string;
  bintang: number;
  ulasan?: string;
}

export interface CreateRatingRequest {
  pesananId: string;
  ratingOverall: number;
  ulasanOverall?: string;
  isPublic?: boolean;
  items: ItemRatingRequest[];
}

export interface RatingResponse {
  ratingId: string;
  pesananId: string;
  bintang: number;
  ulasan: string;
  createdAt: string;
}

export interface PesananRatingStatusResponse {
  isRated: boolean;
  pesananId: string;
}
