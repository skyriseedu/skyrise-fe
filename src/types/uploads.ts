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

export interface UploadUniversityImagesResponse {
  success: boolean;
  message?: string;
  data: {
    coverImage1: UploadedImage;
    coverImage2: UploadedImage;
    studentImage: UploadedImage;
  };
}
