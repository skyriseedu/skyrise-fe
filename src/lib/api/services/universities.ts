import apiClient from '../client';
import type {
  GetUniversitiesRequest,
  GetUniversitiesResponse,
  SingleUniversityResponse,
} from '@/types/users/university';

export const universityService = {
  async getUniversities(
    params: GetUniversitiesRequest = {}
  ): Promise<GetUniversitiesResponse> {
    const { page = 1, limit = 10 } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get(`/universities?${searchParams}`);
    return response.data;
  },

  async getUniversityBySlug(slug: string): Promise<SingleUniversityResponse> {
    const response = await apiClient.get(`/universities/${slug}`);
    return response.data;
  },
};
