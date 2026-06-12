/** Saldo poin + info member untuk halaman Loyalty */
export interface PoinBalanceResponse {
  totalPoint: number;
  rupiahPerPoin: number;
  namaClient: string;
  memberSejak: string; // ISO datetime string dari backend
  totalPoinDiperoleh: number; // total EARN all-time
}

/** Satu entri riwayat transaksi poin */
export interface PoinRiwayatResponse {
  poinTransaksiId: string;
  pesananId: string | null;
  kodePesanan: string | null;
  jumlahPoin: number;
  tipe: 'earn' | 'redeem' | 'refund';
  createdAt: string; // ISO datetime string
}
