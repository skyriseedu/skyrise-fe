import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { programsService } from '@/lib/api';
import { programKeys } from './queryKeys';
import type { UseProgramsParams } from '@/types/users/program';

export function usePrograms(params: UseProgramsParams = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: programKeys.list({ page, limit }),
    queryFn: () => programsService.getPrograms({ page, limit }),
    placeholderData: keepPreviousData,
  });
}
