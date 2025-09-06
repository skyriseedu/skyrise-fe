export interface University {
  id: string;
  name: string;
  location: string;
  country: string;
  image: string;
  logo?: string;
  ranking?: number;
  rankingText?: string; // e.g., "Private, 1st"
  description: string;
  programs: string[];
  programsCount?: number;
  tuitionFee: {
    min: number;
    max: number;
    currency: string;
  };
  applicationFees?: string; // e.g., "Free", "$50", etc.
  acceptanceRate?: number;
  establishedYear: number;
  website?: string;
  tags?: string[];
  campusCount?: number;
}

export interface UniversityCardProps {
  university: University;
  onViewDetails?: (university: University) => void;
  onApply?: (university: University) => void;
  className?: string;
}

export interface GetUniversitiesRequest {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  minTuition?: number;
  maxTuition?: number;
  programs?: string[];
  tags?: string[];
}

export interface GetUniversitiesResponse {
  data: University[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SingleUniversityResponse {
  data: {
    university: University;
  };
}
