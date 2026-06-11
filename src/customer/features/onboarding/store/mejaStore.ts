import type { ScanMejaResponse } from '@shared/types/meja.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store untuk menyimpan data scan meja setelah WelcomePage berhasil POST.
 * Dipakai oleh KatalogPage, KeranjangPage, KonfirmasiPage untuk display
 * tanpa harus POST ulang ke backend.
 */
interface MejaStore {
  scanData: ScanMejaResponse | null;
  setScanData: (data: ScanMejaResponse) => void;
  clearScanData: () => void;
}

export const useMejaStore = create<MejaStore>()(
  persist(
    (set) => ({
      scanData: null,
      setScanData: (data) => set({ scanData: data }),
      clearScanData: () => set({ scanData: null }),
    }),
    {
      name: 'meja-store',
    },
  ),
);
