import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { universityService } from '@/lib/api';
import type {
  CreateUniversityPayload,
  GetAllUniversitiesRequest,
  SearchUniversitiesRequest,
} from '@/types/users/university';
import { universityKeys } from './queryKeys';

export function useAllUniversities(params: GetAllUniversitiesRequest = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: universityKeys.list({ page, limit }),
    queryFn: () => universityService.getAllUniversities({ page, limit }),
  });
}

export function useAllUniversitiesAdmin() {
  return useQuery({
    queryKey: universityKeys.adminLists(),
    queryFn: () => universityService.getAllUniversitiesAdmin(),
  });
}

export function useSearchUniversities(params: SearchUniversitiesRequest = {}) {
  const { q, universityType, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: universityKeys.search({ q, universityType, page, limit }),
    queryFn: () =>
      universityService.searchUniversities({ q, universityType, page, limit }),
    enabled: !!(q || universityType), // Only search if there's a query or filter
  });
}

export function useUniversityBySlug(slug: string) {
  return useQuery({
    queryKey: universityKeys.detail(slug),
    queryFn: () => universityService.getUniversityBySlug(slug),
    enabled: !!slug,
  });
}

export function useGetUniversityByIdAdmin(id: string) {
  return useQuery({
    queryKey: universityKeys.adminDetail(id),
    queryFn: () => universityService.getUniversityByIdAdmin(id),
    enabled: !!id,
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: universityKeys.create({}),
    mutationFn: (payload: CreateUniversityPayload) =>
      universityService.createUniversity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: universityKeys.update('', {}),
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateUniversityPayload;
    }) => universityService.updateUniversity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: universityKeys.delete(''),
    mutationFn: (id: string) => universityService.deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
}

export function useBulkDeleteUniversities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: universityKeys.bulkDelete([]),
    mutationFn: ({ ids }: { ids: string[] }) =>
      universityService.bulkDeleteUniversities(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
}

export function useUpdateUniversityPinStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: universityKeys.pinStatus('', false),
    mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) =>
      universityService.updatePinStatus(id, pinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
}
