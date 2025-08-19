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