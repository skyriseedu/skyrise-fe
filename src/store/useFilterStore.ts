import { create } from 'zustand';

interface FilterStore {
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (isOpen: boolean) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  isMobileFilterOpen: false,
  setIsMobileFilterOpen: (isOpen) => set({ isMobileFilterOpen: isOpen }),
}));
