import apiClient from '../client';

import type {
  BulkDeleteTeamMembersResponse,
  CreateTeamMemberPayload,
  TeamMemberApiItem,
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

  async bulkDeleteTeamMembers(ids: string[]): Promise<BulkDeleteTeamMembersResponse> {
    try {
      const response = await apiClient.post('/team-members/bulk-delete', { ids });
      return response.data;
    } catch (error) {
      console.error('Bulk delete team members API error:', error);
      throw error;
    }
  },

  async createTeamMember(
    payload: CreateTeamMemberPayload
  ): Promise<TeamMemberApiItem> {
    const response = await apiClient.post('/team-members', payload);
    return response.data?.data ?? response.data;
  },
};
