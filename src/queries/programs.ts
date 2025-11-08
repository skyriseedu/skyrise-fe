import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { programsService } from '@/lib/api';
import { programKeys } from './queryKeys';
import type {
  UseProgramsParams,
  ProgramsSearchParams,
  ProgramDetailsApiResponse,
  CreateProgramPayload,
  BulkDeleteProgramsPayload,
  UpdateProgramParams,
} from '@/types/users/program';
import type { ProgramFiltersResponse } from '@/types/users/explore';

export function usePrograms(params: UseProgramsParams = {}) {
  const { page, limit } = params;

  return useQuery({
    queryKey: programKeys.list({ page, limit }),
    queryFn: () => programsService.getPrograms({ page, limit }),
    placeholderData: keepPreviousData,
  });
}

export function useProgramsAdmin() {
  return useQuery({
    queryKey: programKeys.adminList({}),
    queryFn: () => programsService.getProgramsAdmin(),
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
  console.log('useProgramBySlug called with slug:', slug, 'enabled:', !!slug);
  return useQuery<ProgramDetailsApiResponse>({
    queryKey: programKeys.detail(slug),
    queryFn: () => programsService.getProgramBySlug(slug),
    enabled: !!slug,
  });
}

export function useProgramsSearch(
  params: ProgramsSearchParams,
  enabled: boolean
) {
  const { page, limit, q, degrees, programs, fees, duration } = params;
  return useQuery({
    queryKey: programKeys.search({
      page,
      limit,
      q,
      degrees,
      programs,
      fees,
      duration,
    }),
    queryFn: () =>
      programsService.searchPrograms({
        page,
        limit,
        q,
        degrees,
        programs,
        fees,
        duration,
      }),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProgramPayload) =>
      programsService.createProgram(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: programKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: programKeys.adminLists(),
      });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProgramParams) =>
      programsService.updateProgram(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: programKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: programKeys.adminLists(),
      });
      queryClient.invalidateQueries({
        queryKey: programKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => programsService.deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: programKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: programKeys.adminLists(),
      });
    },
  });
}

export function useBulkDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkDeleteProgramsPayload) =>
      programsService.bulkDeletePrograms(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: programKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: programKeys.adminLists(),
      });
    },
  });
}
