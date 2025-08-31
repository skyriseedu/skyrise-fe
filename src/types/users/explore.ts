export interface ExploreFilters {
  degrees: string[];
  programs: string[];
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