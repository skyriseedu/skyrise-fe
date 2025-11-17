import apiClient from '../client';
import type { GetUniversityLogosResponse } from '@/types/users/university-logos';

export const universityLogoService = {
  async getAllLogos(): Promise<GetUniversityLogosResponse> {
    const response = await apiClient.get(`/universities/pinned/logos`);
    return response.data;
  },
};
