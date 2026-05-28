import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface RestoConfigState {
  isOpen: boolean;
  restoName: string;
  alamat: string;
  setRestoConfig: (isOpen: boolean, restoName: string, alamat: string) => void;
}

export const useRestoStore = create<RestoConfigState>()(
  immer((set) => ({
    isOpen: true,
    restoName: 'Aroma Senja',
    alamat: 'Jl. Senopati No. 45, Jakarta Selatan',
    setRestoConfig: (isOpen, restoName, alamat) =>
      set((state) => {
        state.isOpen = isOpen;
        state.restoName = restoName;
        state.alamat = alamat;
      }),
  })),
);
