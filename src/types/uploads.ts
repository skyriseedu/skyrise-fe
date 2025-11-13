export interface UploadedImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface UploadProgramImagesResponse {
  success: boolean;
  message?: string;
  data: {
    images: UploadedImage[];
  };
}
