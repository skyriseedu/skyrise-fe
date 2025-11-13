export type BookingStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type PlatformStatus = 'Website' | 'Social Media'
export const bookingStatusOptions: BookingStatus[] = [
  'Scheduled',
  'Completed',
  'Cancelled',
];

export const platformStatusOptions: PlatformStatus[] = [
  'Website',
  'Social Media'
];

export interface Consultation {
  id?: string;
  _id?: string;
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

export type BookingStatusApi = Lowercase<BookingStatus>;

export interface CreateConsultationRequest {
  name: string;
  email: string;
  phoneNumber: string;
  bookingTimeSchedule: string; // Format: "14:30"
  bookingDateSchedule: string; // ISO string e.g. "2025-03-15T00:00:00.000Z"
  submittedPlatform: string;
  status: BookingStatusApi;
  location?: string;
  question?: string;
  facebookAccount?: string;
}

export interface CreateConsultationResponse {
  success: boolean;
  message: string;
  data: {
    consultation: Consultation;
  };
}

export interface DeleteConsultationResponse {
  success: boolean;
  message: string;
}

export interface BulkDeleteConsultationsRequest {
  ids: string[];
}

export interface BulkDeleteConsultationsResponse {
  success: boolean;
  message: string;
  deletedCount?: number;
}
