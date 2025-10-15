import apiClient from '../client';
import type {
  ConsultationsApiResponse,
  UseConsultationsParams,
  CreateConsultationRequest,
  CreateConsultationResponse,
} from '@/types/bookings';

export const bookingsService = {
  async getConsultations(params: UseConsultationsParams = {}): Promise<ConsultationsApiResponse> {
    const { status} = params;

    const searchParams = new URLSearchParams({});

    if (status) {
      searchParams.append('status', status.toLowerCase());
    }

    const url = `/consultations?${searchParams}`;
    console.log('Fetching consultations from:', url);
    console.log('Params:', { status: status ? status.toLowerCase() : undefined, });
    console.log('Status transformed from:', status, 'to:', status ? status.toLowerCase() : undefined);
    
    try {
      const response = await apiClient.get(url);
      console.log('Consultations API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Consultations API error:', error);
      throw error;
    }
  },

  async createConsultation(data: CreateConsultationRequest): Promise<CreateConsultationResponse> {
    console.log('Creating consultation with data:', data);
    
    try {
      const response = await apiClient.post('/consultations', data);
      console.log('Create consultation API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create consultation API error:', error);
      throw error;
    }
  },
};
