import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PesananAdminState {
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
}

export const usePesananAdminStore = create<PesananAdminState>()(
  immer((set) => ({
    searchQuery: '',

    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),
  })),
);
