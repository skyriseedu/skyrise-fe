import apiClient from '../client';

import type { FaqsResponse, FaqQueryParams } from '@/types/users/faqs';

export const faqsService = {
  async getFaqs({
    page = 1,
    limit = 10,
  }: FaqQueryParams = {}): Promise<FaqsResponse> {
    const response = await apiClient.get('/faqs', {
      params: { page, limit },
    });

    return response.data;
  },
};
