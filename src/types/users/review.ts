export interface Review {
  id: string;
  name: string;
  program: string;
  testimonial: string;
  imageUrl?: string;
  createdAt?: string;
  rating?: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateReviewRequest {
  program: string;
  testimonial: string;
  rating?: number;
}
