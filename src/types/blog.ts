export interface Blog {
  _id: string;
  title: string;
  blogText: string;
  imageUrl?: string;
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

export interface BlogFilterProps {
  selectedCategory: BlogCategory;
  onCategoryChange: (category: BlogCategory) => void;
}
