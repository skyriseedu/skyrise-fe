export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
}

export interface FaqsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: {
    faqs: FaqItem[];
  };
}

export interface FaqQueryParams {
  page?: number;
  limit?: number;
}
