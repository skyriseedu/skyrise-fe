import apiClient from '../client';
import type { StatsResponse } from '@/types/users/home';

export const homeService = {
  async getStats(lang: string = 'en'): Promise<StatsResponse> {
    const response = await apiClient.get(`/overview?lang=${lang}`);
    return response.data;
  },
};
