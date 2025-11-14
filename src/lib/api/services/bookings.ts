import apiClient from '../client';
import type {
  ConsultationsApiResponse,
  UseConsultationsParams,
  CreateConsultationRequest,
  CreateConsultationResponse,
  DeleteConsultationResponse,
  BulkDeleteConsultationsResponse,
  UpdateConsultationRequest,
  UpdateConsultationResponse,
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

  async deleteConsultation(consultationId: string): Promise<DeleteConsultationResponse> {
    console.log('Deleting consultation with ID:', consultationId);
    
    try {
      const response = await apiClient.delete(`/consultations/${consultationId}`);
      console.log('Delete consultation API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete consultation API error:', error);
      throw error;
    }
  },

  async updateConsultation(
    consultationId: string,
    data: UpdateConsultationRequest
  ): Promise<UpdateConsultationResponse> {
    console.log('Updating consultation with ID:', consultationId, 'payload:', data);

    try {
      const response = await apiClient.put(`/consultations/${consultationId}`, data);
      console.log('Update consultation API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update consultation API error:', error);
      throw error;
    }
  },

  async bulkDeleteConsultations(ids: string[]): Promise<BulkDeleteConsultationsResponse> {
    console.log('Bulk deleting consultations with IDs:', ids);

    try {
      const response = await apiClient.post('/consultations/bulk-delete', { ids });
      console.log('Bulk delete consultations API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Bulk delete consultations API error:', error);
      throw error;
    }
  },
};
