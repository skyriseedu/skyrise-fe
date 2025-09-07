import apiClient from '../client';
import type {
  BookConsultationFormValues,
  FormSubmissionResponse,
  ApplicationFormValues,
  ApplyConsultantFormValues,
} from '@/types/users/forms';

export const formsService = {
  async bookConsultation(
    data: BookConsultationFormValues
  ): Promise<FormSubmissionResponse> {
    const response = await apiClient.post('/consultations', data);
    console.log('API Response in book consultation service:', response);
    return response.data;
  },

  async submitApplication(
    data: ApplicationFormValues
  ): Promise<FormSubmissionResponse> {
    const response = await apiClient.post('/applications', data);
    return response.data;
  },

  async submitConsultantApplication(
    data: ApplyConsultantFormValues
  ): Promise<FormSubmissionResponse> {
    const response = await apiClient.post('/apply-consultant', data);
    return response.data;
  },
};
