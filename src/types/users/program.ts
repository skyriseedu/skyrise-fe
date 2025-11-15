import type { Review } from './review';

export interface ProgramStructureItem {
  id: string;
  title: string;
  content: string;
}
export interface ProgramListItem {
  _id: string;
  slug: string;
  programName: string;
  universityName: string;
  applicationDeadline: string | null;
  universityRanking?: string | null;
  keyInformation?: {
    degree?: string;
    duration?: string;
    totalTuitionFees?: string;
    upcomingIntake?: string[];
  };
  images?: ProgramImages;
  about?: string;
  status?: 'published' | 'draftsaved';
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  totalCredits?: number;
  studentReviews?: Review[];
}
export interface ProgramsApiResponse {
  success: boolean;
  message?: string;
  count: number;
  total: number;
  pagination: {
    page: number;
    pages: number;
  };
  data: {
    programs: ProgramListItem[];
  };
}
export interface UseProgramsParams {
  page?: number;
  limit?: number;
}
export interface ProgramsSearchParams extends UseProgramsParams {
  q?: string;
  degrees?: string | string[];
  programs?: string | string[];
  fees?: string | string[];
  duration?: string | string[];
}

export interface ProgramImages {
  image1?: string;
  image2?: string;
}

export interface ProgramKeyInformation {
  degree: string;
  duration: string;
  location: string;
  applicationFee: string;
  totalTuitionFees: string;
  upcomingIntake: string[];
}
export interface ProgramDetails {
  _id: string;
  slug: string;
  programName: string;
  universityName: string;
  about?: string;
  images?: ProgramImages;
  keyInformation?: ProgramKeyInformation;
  undergraduateEntryRequirement?: string;
  status?: 'published' | 'draftsaved';
  views?: number;
  studentReviews?: Review[];
  createdAt: string;
  updatedAt: string;
  applicationDeadline?: string | null;
  universityRanking?: { type: string; number: number } | null;
  creditDetails?: string;
  careerPaths?: string;
  totalCredits?: number;
  __v?: number;
}

export interface ProgramDetailsApiResponse {
  success: boolean;
  message?: string;
  data: ProgramDetails;
}

export interface CreateProgramPayload {
  programName: string;
  universityName: string;
  universityRanking: {
    type: string;
    number: number;
  };
  applicationDeadline: string;
  images: {
    image1?: string;
    image2?: string;
  };
  about: string;
  keyInformation: {
    degree: string;
    duration: string;
    location: string;
    applicationFee: string;
    totalTuitionFees: string;
    upcomingIntake: string[];
  };
  totalCredits: number;
  creditDetails: string;
  undergraduateEntryRequirement: string;
  careerPaths: string;
  studentReviews: {
    studentName: string;
    major: string;
    studentImage: string;
    review: string;
  }[];
  status: 'published' | 'draftsaved';
}

export interface BulkDeleteProgramsPayload {
  ids: string[];
}

export interface UpdateProgramParams {
  id: string;
  payload: Partial<CreateProgramPayload>;
}
