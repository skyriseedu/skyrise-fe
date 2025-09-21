import { useQuery } from '@tanstack/react-query';

import { teamMembersService } from '@/lib/api';

import { teamMemberKeys } from './queryKeys';

export const useTeamMembers = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: teamMemberKeys.paginated(page, limit),
    queryFn: () => teamMembersService.getTeamMembers({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
