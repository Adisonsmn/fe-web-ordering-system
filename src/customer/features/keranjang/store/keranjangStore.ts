import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface KeranjangState {
  catatanPesanan: string;
  gunakanPoin: boolean;
  poinDigunakan: number; // Disimpan dari hasil kalkulasi / input member
  setCatatanPesanan: (catatan: string) => void;
  setGunakanPoin: (gunakan: boolean) => void;
  setPoinDigunakan: (poin: number) => void;
  reset: () => void;
}

export const useKeranjangStore = create<KeranjangState>()(
  immer((set) => ({
    catatanPesanan: '',
    gunakanPoin: false,
    poinDigunakan: 0,
    setCatatanPesanan: (catatan) =>
      set((state) => {
        state.catatanPesanan = catatan;
      }),
    setGunakanPoin: (gunakan) =>
      set((state) => {
        state.gunakanPoin = gunakan;
        if (!gunakan) state.poinDigunakan = 0;
      }),
    setPoinDigunakan: (poin) =>
      set((state) => {
        state.poinDigunakan = poin;
      }),
    reset: () =>
      set((state) => {
        state.catatanPesanan = '';
        state.gunakanPoin = false;
        state.poinDigunakan = 0;
      }),
  })),
);
