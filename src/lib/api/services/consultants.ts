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
    admin = false,
  }: ConsultantsQueryParams = {}): Promise<ConsultantsResponse> {
    const endpoint = admin ? '/consultants/admin/all' : '/consultants';
    const config = admin ? undefined : { params: { page, limit } };

    const response = await apiClient.get(endpoint, config);
    return response.data;
  },

  async getAllConsultantsAdmin(): Promise<ConsultantsResponse> {
    return this.getConsultants({ admin: true });
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
    const response = await apiClient.put(`/consultants/${id}`, { pinned });
    return response.data;
  },
};
