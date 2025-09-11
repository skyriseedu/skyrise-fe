import apiClient from '../client';
import type { consultantCountResponse } from '@/types/users/consultant';

export const consultantService = {
  async getConsultantCount(): Promise<consultantCountResponse> {
    const response = await apiClient.get(`/consultants/total`);
    return response.data;
  },
};
