import apiClient from '../client';
import type {
  GetAllUniversitiesRequest,
  SearchUniversitiesRequest,
  GetUniversitiesResponse,
  SearchUniversitiesResponse,
  SingleUniversityResponse,
} from '@/types/users/university';

export const universityService = {
  async getAllUniversities(
    params: GetAllUniversitiesRequest = {}
  ): Promise<GetUniversitiesResponse> {
    const { page = 1, limit = 10 } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get(`/universities?${searchParams}`);
    return response.data;
  },

  async searchUniversities(
    params: SearchUniversitiesRequest = {}
  ): Promise<SearchUniversitiesResponse> {
    const { q, universityType, page = 1, limit = 10 } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (q) {
      searchParams.append('q', q);
    }

    if (universityType) {
      searchParams.append('universityType', universityType);
    }

    console.log('Search Params before api call:', searchParams.toString());
    const response = await apiClient.get(
      `/universities/search?${searchParams}`
    );
    console.log('API Response in search universities service:', response);
    return response.data;
  },

  async getUniversityBySlug(slug: string): Promise<SingleUniversityResponse> {
    const response = await apiClient.get(`/universities/${slug}`);
    return response.data;
  },

  async getUniversityById(id: string): Promise<SingleUniversityResponse> {
    const response = await apiClient.get(`/universities/${id}`);
    return response.data;
  },
};
