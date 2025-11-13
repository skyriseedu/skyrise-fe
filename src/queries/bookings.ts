import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsService } from '@/lib/api';
import { bookingKeys } from './queryKeys';
import type { UseConsultationsParams, CreateConsultationRequest } from '@/types/bookings';

export function useConsultations(params: UseConsultationsParams = {}) {
  const { status, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: bookingKeys.consultationsList({ status, page, limit }),
    queryFn: () => bookingsService.getConsultations({ status, page, limit }),
    enabled: true, 
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConsultationRequest) => bookingsService.createConsultation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
    onError: (error) => {
      console.error('Failed to create consultation:', error);
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consultationId: string) => bookingsService.deleteConsultation(consultationId),
    onSuccess: () => {
      // Invalidate and refetch consultations queries to remove the deleted consultation
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
    onError: (error) => {
      console.error('Failed to delete consultation:', error);
    },
  });
}

export function useBulkDeleteConsultations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => bookingsService.bulkDeleteConsultations(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
    onError: (error) => {
      console.error('Failed to bulk delete consultations:', error);
    },
  });
}
