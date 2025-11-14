import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { teamMembersService } from '@/lib/api';

import { teamMemberKeys } from './queryKeys';
import type { UpdateTeamMemberParams } from '@/types/users/team';

export const useTeamMembers = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: teamMemberKeys.paginated(page, limit),
    queryFn: () => teamMembersService.getTeamMembers({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

export const useBulkDeleteTeamMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => teamMembersService.bulkDeleteTeamMembers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMemberKeys.all });
    },
    onError: (error) => {
      console.error('Failed to bulk delete team members:', error);
    },
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamMembersService.createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMemberKeys.all });
    },
    onError: (error) => {
      console.error('Failed to create team member:', error);
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTeamMemberParams) =>
      teamMembersService.updateTeamMember(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMemberKeys.all });
    },
    onError: (error) => {
      console.error('Failed to update team member:', error);
    },
  });
};
