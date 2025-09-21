import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/lib/api';
import { blogKeys } from './queryKeys';
import type { UseBlogsParams } from '@/types/users/blog';

export function useBlogs(params: UseBlogsParams = {}) {
  const { category, page = 1, limit = 5 } = params;

  return useQuery({
    queryKey: blogKeys.list({ category, page, limit }),
    queryFn: () => blogService.getBlogs({ category, page, limit }),
  });
}

export function useLatestBlogs(limit: number = 3) {
  return useQuery({
    queryKey: blogKeys.latest(limit),
    queryFn: () => blogService.getLatestBlogs(limit),
    enabled: limit > 0, // Only fetch if limit is greater than 0
  });
}

export function useCategoryBlogs(category: string) {
  return useQuery({
    queryKey: blogKeys.category(category),
    queryFn: () => blogService.getBlogsByCategory(category),
    enabled: !!category && category !== 'All Categories', // Only fetch if category is valid
  });
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => blogService.getBlogBySlug(slug),
    enabled: !!slug,
  });
}
