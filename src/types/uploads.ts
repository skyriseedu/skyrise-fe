export interface UploadedImage {
  id: string;
  url: string;
}

export interface UploadProgramImagesResponse {
  success: boolean;
  message?: string;
  data: UploadedImage[];
}
