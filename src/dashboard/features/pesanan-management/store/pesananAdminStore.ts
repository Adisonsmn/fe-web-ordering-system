import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type FilterDate = 'SEMUA' | 'HARI_INI' | 'KEMARIN';

interface PesananAdminState {
  searchQuery: string;
  filterDate: FilterDate;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterDate: (filter: FilterDate) => void;
}

export const usePesananAdminStore = create<PesananAdminState>()(
  immer((set) => ({
    searchQuery: '',
    filterDate: 'SEMUA',

    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),

    setFilterDate: (filter) =>
      set((state) => {
        state.filterDate = filter;
      }),
  })),
);
