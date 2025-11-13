import apiClient from '../client';
import type {
  BookConsultationFormValues,
  FormSubmissionResponse,
  ApplicationFormValues,
  ApplyConsultantFormValues,
} from '@/types/users/forms';
import type { BookingStatusApi, CreateConsultationRequest } from '@/types/bookings';

export const formsService = {
  async bookConsultation(
    data: BookConsultationFormValues
  ): Promise<FormSubmissionResponse> {
    const payload: CreateConsultationRequest = {
      name: data.name.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber.replace(/\s+/g, ''),
      bookingTimeSchedule: data.bookingTimeSchedule,
      bookingDateSchedule: data.bookingDateSchedule,
      submittedPlatform: data.submittedPlatform?.trim() || 'website',
      status: (data.status ?? 'scheduled') as BookingStatusApi,
      location: data.location.trim(),
      question: data.question?.trim() || undefined,
      facebookAccount: data.facebookAccount?.trim() || undefined,
    };

    const response = await apiClient.post('/consultations', payload);
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
