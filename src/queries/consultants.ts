import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { consultantService } from '@/lib/api';
import type { UpdateConsultantParams } from '@/types/users/consultant';

export const consultantKeys = {
  all: ['consultants'] as const,
  paginated: (page: number, limit: number) =>
    [...consultantKeys.all, 'paginated', page, limit] as const,
  adminAll: () => [...consultantKeys.all, 'admin', 'all'] as const,
};

export function useConsultantCount() {
  return useQuery({
    queryKey: ['consultantCount'],
    queryFn: () => consultantService.getConsultantCount(),
  });
}

export const useConsultants = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: consultantKeys.paginated(page, limit),
    queryFn: () => consultantService.getConsultants({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

export const useAllConsultantsAdmin = () => {
  return useQuery({
    queryKey: consultantKeys.adminAll(),
    queryFn: () => consultantService.getAllConsultantsAdmin(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useConsultantById = (id: string) => {
  return useQuery({
    queryKey: ['consultantById', id],
    queryFn: () => consultantService.getConsultantById(id),
    enabled: !!id,
  });
};

export const useDeleteConsultant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => consultantService.deleteConsultant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultantKeys.all });
    },
    onError: (error) => {
      console.error('Failed to delete consultant:', error);
    },
  });
};

export const useBulkDeleteConsultants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => consultantService.bulkDeleteConsultants(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultantKeys.all });
      queryClient.invalidateQueries({ queryKey: consultantKeys.adminAll() });
    },
    onError: (error) => {
      console.error('Failed to bulk delete consultants:', error);
    },
  });
};

export const useCreateConsultant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: consultantService.createConsultant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultantKeys.all });
      queryClient.invalidateQueries({ queryKey: consultantKeys.adminAll() });
    },
    onError: (error) => {
      console.error('Failed to create consultant:', error);
    },
  });
};

export const useUpdateConsultant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateConsultantParams) =>
      consultantService.updateConsultant(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultantKeys.all });
      queryClient.invalidateQueries({ queryKey: consultantKeys.adminAll() });
    },
    onError: (error) => {
      console.error('Failed to update consultant:', error);
    },
  });
};

export const useUpdateConsultantPinStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) =>
      consultantService.updatePinStatus(id, pinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultantKeys.all });
      queryClient.invalidateQueries({ queryKey: consultantKeys.adminAll() });
    },
  });
};
