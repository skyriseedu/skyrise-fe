import { create } from 'zustand';
import { programsService } from '@/lib/api';
import type { FilterOption } from '@/types/users/explore';

interface ProgramOptionsState {
  degrees: FilterOption[];
  programs: FilterOption[];
  fees: FilterOption[];
  durations: FilterOption[];
  sortOptions: FilterOption[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchFilters: () => Promise<void>;
}

export const useProgramOptionsStore = create<ProgramOptionsState>((set) => ({
  degrees: [],
  programs: [],
  fees: [],
  durations: [],
  sortOptions: [],
  loading: false,
  error: null,
  fetched: false,
  fetchFilters: async () => {
    set({ loading: true, error: null });
    try {
      const res = await programsService.getProgramFilters();
      const d = res?.data || {};
      set({
        degrees: d.degrees || [],
        programs: d.programs || [],
        fees: d.fees || [],
        durations: d.durations || [],
        sortOptions: d.sortOptions || [],
        loading: false,
        error: null,
        fetched: true,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load filters';
      set({ loading: false, error: message });
    }
  },
}));
