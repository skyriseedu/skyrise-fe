import apiClient from '../client';
import type { ProgramsApiResponse, UseProgramsParams } from '@/types/users/program';

export const programsService = {
  async getPrograms(
    params: UseProgramsParams = { page: 1, limit: 10 }
  ): Promise<ProgramsApiResponse> {
    const { page = 1, limit = 10 } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get(`/programs?${searchParams}`);
    return response.data;
  },
};

