export interface Program {
  id: string;
  slug: string;
  title: string;
  university: string;
  upcomingIntake: string;
  duration: string;
  ranking: string;
  rankingYear: string;
  totalTuitionFees: string;
  applicationDeadline: string;
  description?: string;
  keyInfo?: KeyInfo[];
  programStructure?: ProgramStructureItem[];
}

export interface KeyInfo {
  icon: string;
  label: string;
  value: string;
}

export interface ProgramStructureItem {
  id: string;
  title: string;
  content: string;
}

export interface ProgramsResponse {
  programs: Program[];
  total: number;
  page: number;
  limit: number;
}

export interface ProgramDetailsResponse {
  program: Program;
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
    programs: any[]; 
  };
}

export interface UseProgramsParams {
  page?: number;
  limit?: number;
}

export interface ProgramsSearchParams extends UseProgramsParams {
  q?: string;
  degree?: string;
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

export interface StudentReview {
  _id: string;
  studentName: string;
  major: string;
  studentImage: string;
  review: string;
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
  status?: 'published' | 'draft' | 'archived';
  views?: number;
  studentReviews?: StudentReview[];
  createdAt: string;
  updatedAt: string;
  applicationDeadline?: string | null;
  universityRanking?: string | null;
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
