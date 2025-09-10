export interface UniversityFilters {
  universityType: ('Public' | 'Private')[];
  searchQuery?: string;
}

export interface UniversityFilterOption {
  label: string;
  value: 'Public' | 'Private';
}

export interface UniversityFilterSection {
  id: keyof UniversityFilters;
  label: string;
  options?: UniversityFilterOption[];
}
