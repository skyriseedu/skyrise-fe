export type BookingStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export const bookingStatusOptions: BookingStatus[] = [
  'Scheduled',
  'Completed',
  'Cancelled',
];

export interface Consultation {
  id: string;
  userId: string;
  consultantId: string;
  date: string;
  time: string;
  status: BookingStatus;
  notes?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  consultant?: {
    id: string;
    name: string;
    email: string;
    specialization?: string;
  };
}

export interface ConsultationsApiResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Consultation[]; 
}

export interface UseConsultationsParams {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

export interface CreateConsultationRequest {
  name: string;
  email: string;
  phoneNumber: string;
  bookingTimeSchedule: string; // Format: "14:30"
  bookingDateSchedule: string; // Format: "2025-03-15T00:00:00.000Z"
  location?: string;
  question?: string;
}

export interface CreateConsultationResponse {
  success: boolean;
  message: string;
  data: {
    consultation: Consultation;
  };
}
