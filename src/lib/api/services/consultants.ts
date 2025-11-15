import apiClient from '../client';
import type {
  consultantCountResponse,
  ConsultantsQueryParams,
  ConsultantsResponse,
  CreateConsultantPayload,
  Consultant,
  BulkDeleteConsultantsResponse,
} from '@/types/users/consultant';

export const consultantService = {
  async getConsultantCount(): Promise<consultantCountResponse> {
    const response = await apiClient.get(`/consultants/total`);
    return response.data;
  },

  async getConsultants({
    page = 1,
    limit = 10,
  }: ConsultantsQueryParams = {}): Promise<ConsultantsResponse> {
    const response = await apiClient.get('/consultants', {
      params: { page, limit },
    });
    return response.data;
  },

  async getAllConsultantsAdmin(): Promise<ConsultantsResponse> {
    const response = await apiClient.get('/consultants/admin/all');
    return response.data;
  },

  async getConsultantById(id: string): Promise<Consultant> {
    const response = await apiClient.get(`/consultants/admin/${id}`);
    return response.data;
  },

  async bulkDeleteConsultants(
    ids: string[]
  ): Promise<BulkDeleteConsultantsResponse> {
    try {
      const response = await apiClient.post('/consultants/bulk-delete', {
        ids,
      });
      return response.data;
    } catch (error) {
      console.error('Bulk delete consultants API error:', error);
      throw error;
    }
  },

  async deleteConsultant(id: string): Promise<Consultant> {
    const response = await apiClient.delete(`/consultants/${id}`);
    return response.data;
  },

  async createConsultant(
    payload: CreateConsultantPayload
  ): Promise<Consultant> {
    const response = await apiClient.post('/consultants', payload);
    return response.data?.data ?? response.data;
  },

  async updateConsultant(
    id: string,
    payload: Partial<CreateConsultantPayload>
  ): Promise<Consultant> {
    const response = await apiClient.put(`/consultants/${id}`, payload);
    return response.data?.data ?? response.data;
  },

  async updatePinStatus(id: string, pinned: boolean): Promise<Consultant> {
    const response = await apiClient.patch(`/consultants/${id}/pin`, {
      pinned,
    });
    return response.data?.data ?? response.data;
  },
};
