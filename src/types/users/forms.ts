import type { BookingStatusApi } from '@/types/bookings';

export interface BookConsultationFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  bookingTimeSchedule: string;
  bookingDateSchedule: string; // ISO date string
  location: string;
  question: string;
  submittedPlatform?: string;
  status?: BookingStatusApi;
  facebookAccount?: string;
}

export interface ApplicationFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  bookingTimeSchedule: string;
  bookingDateSchedule: string; // ISO date string
  location: string;
  question: string;
}

export interface ApplyConsultantFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  reason: string;
  experience?: string;
  qualifications?: string;
  specialization?: string;
}

export interface FormSubmissionResponse {
  id: string;
  message: string;
  success: boolean;
}

export interface FormError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface BulkDeleteApplicationsResponse {
  success: boolean;
  message: string;
  deletedCount?: number;
}
