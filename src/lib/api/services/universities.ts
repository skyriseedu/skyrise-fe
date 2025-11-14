import apiClient from '../client';
import type {
  GetAllUniversitiesRequest,
  SearchUniversitiesRequest,
  GetUniversitiesResponse,
  SearchUniversitiesResponse,
  SingleUniversityResponse,
  CreateUniversityPayload,
  BulkDeleteUniversitiesResponse,
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

  async getAllUniversitiesAdmin(): Promise<GetUniversitiesResponse> {
    const response = await apiClient.get('/universities/admin/all');
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

    const response = await apiClient.get(
      `/universities/search?${searchParams}`
    );
    return response.data;
  },

  async getUniversityBySlug(slug: string): Promise<SingleUniversityResponse> {
    const response = await apiClient.get(`/universities/${slug}`);
    return response.data;
  },

  async getUniversityByIdAdmin(id: string): Promise<SingleUniversityResponse> {
    const response = await apiClient.get(`/universities/admin/${id}`);
    return response.data;
  },

  async createUniversity(
    payload: CreateUniversityPayload
  ): Promise<SingleUniversityResponse> {
    const response = await apiClient.post('/universities', payload, {});
    return response.data;
  },

  async updateUniversity(
    id: string,
    payload: CreateUniversityPayload
  ): Promise<SingleUniversityResponse> {
    const response = await apiClient.put(`/universities/${id}`, payload, {});
    return response.data;
  },

  async deleteUniversity(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/universities/${id}`);
    return response.data;
  },

  async bulkDeleteUniversities(
    ids: string[]
  ): Promise<BulkDeleteUniversitiesResponse> {
    const response = await apiClient.post('/universities/bulk-delete', {
      ids,
    });
    return response.data;
  },

  async updatePinStatus(
    id: string,
    pinned: boolean
  ): Promise<SingleUniversityResponse> {
    const response = await apiClient.patch(`/universities/${id}/pinned`, {
      pinned,
    });
    return response.data;
  },
};
