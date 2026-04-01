export interface Blog {
  _id: string;
  title: string;
  blogText: string;
  imageUrl?: string;
  youtubeUrl?: string;
  description?: string;
  category: 'program' | 'university' | 'visa' | 'student reviews';
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  readingTime: number;
  views: number;
  postedDate: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export type BlogCategory =
  | 'All Categories'
  | 'program'
  | 'university'
  | 'visa'
  | 'student reviews';

// API Response Types
export interface BlogsApiResponse {
  success: boolean;
  message: string;
  count: number;
  data: {
    blogs: Blog[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalBlogs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface LatestBlogsApiResponse {
  success: boolean;
  message: string;
  count: number;
  data: {
    blogs: Blog[];
  };
}

export interface CategoryBlogsApiResponse {
  success: boolean;
  message: string;
  count: number;
  data: {
    blogs: Blog[];
  };
}

export interface SingleBlogApiResponse {
  success: boolean;
  message: string;
  data: {
    blog: Blog;
  };
}

// Hook Types
export interface UseBlogsParams {
  category?: string;
  page?: number;
  limit?: number;
}

export interface UseBlogsReturn {
  blogs: Blog[];
  isLoading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  refetch: () => void;
}

export interface UseLatestBlogsReturn {
  latestBlogs: Blog[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseCategoryBlogsReturn {
  categoryBlogs: Blog[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface CreateBlogPayload {
  title: string;
  category: Blog['category'];
  imageUrl?: string;
  youtubeUrl?: string;
  description?: string;
  blogText: string;
  status: Blog['status'];
}

export interface UpdateBlogParams {
  id: string;
  payload: Partial<CreateBlogPayload>;
}
