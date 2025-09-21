import apiClient from '../client';

import type {
  TeamMembersQueryParams,
  TeamMembersResponse,
} from '@/types/users/team';

export const teamMembersService = {
  async getTeamMembers({
    page = 1,
    limit = 10,
  }: TeamMembersQueryParams = {}): Promise<TeamMembersResponse> {
    const response = await apiClient.get('/team-members', {
      params: { page, limit },
    });

    return response.data;
  },
};
