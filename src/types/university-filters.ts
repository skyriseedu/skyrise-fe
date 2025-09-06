export interface UniversityFilters {
  universityType: string[];
}

export interface UniversityFilterOption {
  label: string;
  value: string;
}

export interface UniversityFilterSection {
  id: keyof UniversityFilters;
  label: string;
  options?: UniversityFilterOption[];
}
