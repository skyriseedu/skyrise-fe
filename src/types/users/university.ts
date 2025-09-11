export interface University {
  _id: string;
  id: string;
  universityName: string;
  universityType: 'Public' | 'Private' | 'International';
  logoImage: string;
  coverImages: {
    image1: string;
    image2: string;
  };
  aboutUniversity: string;
  englishFoundation: string;
  bachelor: string;
  master: string;
  keyInformation: {
    ranking: string;
    foundedYear: number;
    location: string;
    creditTransfer: string;
    programs: number;
  };
  studentReviews: Array<{
    _id: string;
    studentName: string;
    major: string;
    studentImage: string;
    review: string;
  }>;
  status: 'published' | 'draft' | 'archived';
  views: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface UniversityCardProps {
  university: University;
  onViewDetails?: (university: University) => void;
  onApply?: (university: University) => void;
  className?: string;
}

export interface GetAllUniversitiesRequest {
  page?: number;
  limit?: number;
}

export interface SearchUniversitiesRequest {
  q?: string;
  universityType?: 'Public' | 'Private';
  page?: number;
  limit?: number;
}

export interface GetUniversitiesResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: {
    universities: University[];
  };
}

export interface SearchUniversitiesResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  filters: {
    q?: string;
    universityType?: string;
  };
  data: {
    universities: University[];
  };
}

export interface SingleUniversityResponse {
  success: boolean;
  data: {
    university: University;
  };
}
