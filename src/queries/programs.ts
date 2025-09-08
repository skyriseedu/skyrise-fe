import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { programsService } from '@/lib/api';
import { programKeys } from './queryKeys';
import type { UseProgramsParams, ProgramsSearchParams, ProgramDetailsApiResponse } from '@/types/users/program';
import type { ProgramFiltersResponse } from '@/types/users/explore';

export function usePrograms(params: UseProgramsParams = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: programKeys.list({ page, limit }),
    queryFn: () => programsService.getPrograms({ page, limit }),
    placeholderData: keepPreviousData,
  });
}

export function useProgramFilters() {
  return useQuery<ProgramFiltersResponse>({
    queryKey: programKeys.filters(),
    queryFn: () => programsService.getProgramFilters(),
    staleTime: 60 * 60 * 2000, // 2 hour
  });
}

export function useProgramBySlug(slug: string) {
  return useQuery<ProgramDetailsApiResponse>({
    queryKey: programKeys.detail(slug),
    queryFn: () => programsService.getProgramBySlug(slug),
    enabled: !!slug,
  });
}

export function useProgramsSearch(params: ProgramsSearchParams, enabled: boolean) {
  const { page = 1, limit = 10, q, degree, programs, fees, duration } = params;
  return useQuery({
    queryKey: programKeys.search({ page, limit, q, degree, programs, fees, duration }),
    queryFn: () =>
      programsService.searchPrograms({
        page,
        limit,
        q,
        degree,
        programs,
        fees,
        duration,
      }),
    enabled,
    placeholderData: keepPreviousData,
  });
}
