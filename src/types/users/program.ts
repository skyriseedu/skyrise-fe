export interface Program {
  id: string;
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
