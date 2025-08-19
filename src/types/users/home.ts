export interface StatsData {
  studentConsultants: { text: string; count: number };
  scholarship: { text: string; count: number };
  universities: { text: string; count: number };
  programs: { text: string; count: number };
  reviews: { text: string; count: number };
}

export interface StatsResponse {
  success: boolean;
  data: StatsData;
  message?: string;
}
