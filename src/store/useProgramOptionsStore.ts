import { create } from 'zustand';
import { programsService } from '@/lib/api';
import type { FilterOption } from '@/types/users/explore';

interface ProgramOptionsState {
  locations: FilterOption[];
  degrees: FilterOption[];
  programs: FilterOption[];
  fees: FilterOption[];
  durations: FilterOption[];
  sortOptions: FilterOption[];
  loadedLocation: string | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchFilters: (location?: string) => Promise<void>;
}

export const useProgramOptionsStore = create<ProgramOptionsState>((set, get) => ({
  locations: [],
  degrees: [],
  programs: [],
  fees: [],
  durations: [],
  sortOptions: [],
  loadedLocation: null,
  loading: false,
  error: null,
  fetched: false,
  fetchFilters: async (location?: string) => {
    const normalizedLocation = location?.trim() || null;
    const { loading, loadedLocation, fetched } = get();
    if (loading) return;
    if (fetched && loadedLocation === normalizedLocation) return;

    set({ loading: true, error: null, fees: [] });
    try {
      const res = await programsService.getProgramFilters(
        normalizedLocation || undefined
      );
      const d = res?.data || {};
      set({
        locations: d.locations || [],
        degrees: d.degrees || [],
        programs: d.programs || [],
        fees: d.fees || [],
        durations: d.durations || [],
        sortOptions: d.sortOptions || [],
        loading: false,
        error: null,
        fetched: true,
        loadedLocation: normalizedLocation,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load filters';
      set({ loading: false, error: message });
    }
  },
}));
