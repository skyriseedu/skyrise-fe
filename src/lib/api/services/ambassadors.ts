import apiClient from '../client';

import type {
  AmbassadorQueryParams,
  AmbassadorResponse,
} from '@/types/users/ambassadors';

export const ambassadorsService = {
  async getAmbassadors({ page = 1, limit = 10 }: AmbassadorQueryParams = {}): Promise<AmbassadorResponse> {
    const response = await apiClient.get('/ambassadors', {
      params: { page, limit },
    });

    return response.data;
  },
};
