import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formsService } from '@/lib/api';
import type {
  BookConsultationFormValues,
  FormSubmissionResponse,
  ApplicationFormValues,
  ApplyConsultantFormValues,
  FormError,
} from '@/types/users/forms';
import type {
  BookingStatusApi,
  CreateConsultationRequest,
  UpdateConsultationRequest,
} from '@/types/bookings';

export const useBookConsultation = () => {
  return useMutation<
    FormSubmissionResponse,
    FormError,
    BookConsultationFormValues
  >({
    mutationFn: (data: BookConsultationFormValues) =>
      formsService.bookConsultation(data),
    onSuccess: (data) => {
      console.log('Consultation form submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Error submitting consultation form:', error);
    },
  });
};

export const useSubmitApplication = () => {
  return useMutation<FormSubmissionResponse, FormError, ApplicationFormValues>({
    mutationFn: (data: ApplicationFormValues) => formsService.submitApplication(data),
    onSuccess: (data) => {
      console.log('Application form submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Error submitting application form:', error);
    },
  });
};

export const useCreateApplicationBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<FormSubmissionResponse, FormError, CreateConsultationRequest>({
    mutationFn: (data: CreateConsultationRequest) =>
      formsService.createApplicationBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'applications'] });
    },
    onError: (error) => {
      console.error('Error creating admission application booking:', error);
    },
  });
};

type UpdateApplicationMutationParams = {
  applicationId: string;
  payload: UpdateConsultationRequest;
};

type UpdateApplicationStatusParams = {
  applicationId: string;
  status: BookingStatusApi;
};

export const useUpdateApplicationBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<FormSubmissionResponse, FormError, UpdateApplicationMutationParams>({
    mutationFn: ({ applicationId, payload }) =>
      formsService.updateApplicationBooking(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'applications'] });
    },
    onError: (error) => {
      console.error('Error updating admission application booking:', error);
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<FormSubmissionResponse, FormError, UpdateApplicationStatusParams>({
    mutationFn: ({ applicationId, status }) =>
      formsService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'applications'] });
    },
    onError: (error) => {
      console.error('Error updating admission application status:', error);
    },
  });
};

export const useApplyConsultantApplication = () => {
  return useMutation<
    FormSubmissionResponse,
    FormError,
    ApplyConsultantFormValues
  >({
    mutationFn: (data: ApplyConsultantFormValues) =>
      formsService.submitConsultantApplication(data),
    onSuccess: (data) => {
      console.log('Consultant application submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Error submitting consultant application:', error);
    },
  });
};

export function useApplications(params: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ['forms', 'applications', { page, limit }],
    queryFn: () => formsService.getApplications({ page, limit }),
    enabled: true,
  });
}

export function useBulkDeleteApplications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => formsService.bulkDeleteApplications(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'applications'] });
    },
    onError: (error) => {
      console.error('Failed to bulk delete applications:', error);
    },
  });
}
