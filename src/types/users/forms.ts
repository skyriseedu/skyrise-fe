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

export type ApplicationRecord = Record<string, unknown>;

export interface ApplicationsResponse {
  success?: boolean;
  message?: string;
  total?: number;
  count?: number;
  data?: ApplicationRecord[];
}

export interface ConsultantApplication {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsultantApplicationsResponse {
  success?: boolean;
  message?: string;
  total?: number;
  count?: number;
  data?: ConsultantApplication[] | {
    applications?: ConsultantApplication[];
    consultantApplications?: ConsultantApplication[];
  };
  consultantApplications?: ConsultantApplication[];
  applications?: ConsultantApplication[];
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
