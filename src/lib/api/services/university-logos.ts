import apiClient from '../client';
import type { GetUniversityLogosResponse } from '@/types/users/university-logos';

export const universityLogoService = {
  async getAllLogos(): Promise<GetUniversityLogosResponse> {
    const response = await apiClient.get(`/university-logos/all`);
    return response.data;
  },
};
