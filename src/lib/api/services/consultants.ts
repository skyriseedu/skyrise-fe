import apiClient from '../client';
import type { ConsultantsApiResponse } from '@/types/users/about-us';

export const consultantsService = {
  async getConsultants(): Promise<ConsultantsApiResponse> {
    const response = await apiClient.get(`/consultants`);
    return response.data;
  },
};
