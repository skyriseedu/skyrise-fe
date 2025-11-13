import { useMutation, useQuery } from '@tanstack/react-query';
import { formsService } from '@/lib/api';
import type {
  BookConsultationFormValues,
  FormSubmissionResponse,
  ApplicationFormValues,
  ApplyConsultantFormValues,
  FormError,
} from '@/types/users/forms';

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
    mutationFn: (data: ApplicationFormValues) =>
      formsService.submitApplication(data),
    onSuccess: (data) => {
      console.log('Application form submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Error submitting application form:', error);
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
