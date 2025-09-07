export interface Review {
  id: string;
  name: string;
  program: string;
  testimonial: string;
  imageUrl?: string;
  createdAt?: string;
  rating?: number;
}

// actual review structure
export interface StudentReview {
  _id: string;
  studentName: string;
  major: string;
  studentImage: string;
  review: string;
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
