export interface ExploreFilters {
  degrees: string[];
  programs: string[];
  location: string;
  tuitionRanges: string[];
  duration: string[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  id: keyof ExploreFilters;
  label: string;
  options?: FilterOption[];
}
export interface ProgramFiltersResponse {
  success: boolean;
  message?: string;
  data: {
    locations: FilterOption[];
    degrees: FilterOption[];
    programs: FilterOption[];
    fees: FilterOption[];
    durations: FilterOption[];
    sortOptions?: FilterOption[];
  };
}
