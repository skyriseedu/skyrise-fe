import apiClient from '../client';
import type { UploadProgramImagesResponse } from '@/types/uploads';

export const uploadsService = {
  async uploadProgramImages(
    payload: FormData
  ): Promise<UploadProgramImagesResponse> {
    const response = await apiClient.post(
      '/cloudinary-upload/program-images',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
