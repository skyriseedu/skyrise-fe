import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/lib/api';
import { blogKeys } from './queryKeys';
import type {
  CreateBlogPayload,
  UpdateBlogParams,
  UseBlogsParams,
} from '@/types/users/blog';

export function useBlogs(params: UseBlogsParams = {}) {
  const { category, page = 1, limit = 5 } = params;

  return useQuery({
    queryKey: blogKeys.list({ category, page, limit }),
    queryFn: () => blogService.getBlogs({ category, page, limit }),
  });
}

export function useBlogsAdmin(params: UseBlogsParams = {}) {
  const { category, page = 1, limit = 1000 } = params; // no pagination for admin view, fetch all

  return useQuery({
    queryKey: blogKeys.list({ admin: true, category, page, limit }),
    queryFn: () => blogService.getBlogsAdmin({ category, page, limit }),
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

export function useBlogBySlugAdmin(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(`admin:${slug}`),
    queryFn: () => blogService.getBlogBySlugAdmin(slug),
    enabled: !!slug,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlogPayload) => blogService.createBlog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateBlogParams) => blogService.updateBlog(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useBulkDeleteBlogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids }: { ids: string[] }) =>
      blogService.bulkDeleteBlogs(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}
