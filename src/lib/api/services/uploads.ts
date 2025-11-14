import apiClient from '../client';
import type {
  UploadProgramImagesResponse,
  UploadTeamMemberImageResponse,
} from '@/types/uploads';

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

  async uploadTeamMemberImage(
    payload: FormData
  ): Promise<UploadTeamMemberImageResponse> {
    const response = await apiClient.post(
      '/cloudinary-upload/team-member-image',
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
