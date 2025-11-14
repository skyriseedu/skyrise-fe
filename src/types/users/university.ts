import type { StudentReview } from './review';

export interface University {
  _id: string;
  id: string;
  coverImages: {
    image1: string;
    image2: string;
  };
  applicationFee?: {
    amount: number;
    currency: string;
  };
  universityName: string;
  universityType: 'Public' | 'Private';
  logoImage: string;
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
  numberOfCampus: number;
  studentReviews: Array<StudentReview>;
  status: 'published' | 'draft' | 'archived';
  views: number;
  intakes: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  pinned?: boolean;
  pinnedAt?: string;
  entryRequirement?: string;
  scholarshipRequirements?: string;
}

export interface UniversityCardProps {
  university: University;
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

export interface CreateUniversityPayload {
  universityName: string;
  universityType: 'Public' | 'Private';
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
  numberOfCampus: number;
  intakes: string[];
  entryRequirement?: string;
  scholarshipRequirements?: string;
}

export interface BulkDeleteUniversitiesResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
    deletedIds: string[];
  };
}
