import apiClient from '../client';
import type {
  BlogsApiResponse,
  CreateBlogPayload,
  LatestBlogsApiResponse,
  CategoryBlogsApiResponse,
  SingleBlogApiResponse,
  UpdateBlogParams,
  UseBlogsParams,
} from '@/types/users/blog';

export const blogService = {
  async getBlogs(params: UseBlogsParams = {}): Promise<BlogsApiResponse> {
    const { category, page = 1, limit = 5 } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (category && category !== 'All Categories') {
      searchParams.append('category', category);
    }

    const response = await apiClient.get(`/blogs?${searchParams}`);
    return response.data;
  },

  async getBlogsAdmin(params: UseBlogsParams = {}): Promise<BlogsApiResponse> {
    const { category, page = 1, limit = 1000 } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (category && category !== 'All Categories') {
      searchParams.append('category', category);
    }

    const response = await apiClient.get(`/blogs/admin/all?${searchParams}`);
    return response.data;
  },

  async getLatestBlogs(limit: number = 3): Promise<LatestBlogsApiResponse> {
    const response = await apiClient.get(`/blogs/latest?limit=${limit}`);
    return response.data;
  },

  async getBlogsByCategory(
    category: string
  ): Promise<CategoryBlogsApiResponse> {
    const response = await apiClient.get(`/blogs/category/${category}`);
    return response.data;
  },

  async getBlogBySlug(slug: string): Promise<SingleBlogApiResponse> {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data;
  },

  async getBlogBySlugAdmin(slug: string): Promise<SingleBlogApiResponse> {
    const response = await apiClient.get(`/blogs/admin/slug/${slug}`);
    return response.data;
  },

  async createBlog(payload: CreateBlogPayload): Promise<SingleBlogApiResponse> {
    const response = await apiClient.post('/blogs', payload);
    return response.data;
  },

  async updateBlog({
    id,
    payload,
  }: UpdateBlogParams): Promise<SingleBlogApiResponse> {
    const response = await apiClient.put(`/blogs/${id}`, payload);
    return response.data;
  },

  async deleteBlog(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  },

  async bulkDeleteBlogs(ids: string[]): Promise<{ success: boolean }> {
    const response = await apiClient.post('/blogs/bulk-delete', { ids });
    return response.data;
  },
};
