export interface Review {
  _id: string;
  studentName: string;
  major: string;
  studentImage?: string;
  review: string;
  createdAt?: string;
}

export interface ReviewsResponse {
  studentReviews: Review[];
  total: number;
  page: number;
  limit: number;
}