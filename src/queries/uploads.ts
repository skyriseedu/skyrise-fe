import { useMutation } from '@tanstack/react-query';
import { uploadsService } from '@/lib/api';

export function useUploadProgramImages() {
  return useMutation({
    mutationFn: (payload: FormData) =>
      uploadsService.uploadProgramImages(payload),
  });
}

export function useUploadUniversityImages() {
  return useMutation({
    mutationFn: (payload: FormData) =>
      uploadsService.uploadUniversityImages(payload),
  });
}

export function useUploadTeamMemberImage() {
  return useMutation({
    mutationFn: (payload: FormData) =>
      uploadsService.uploadTeamMemberImage(payload),
  });
}

export function useUploadConsultantImage() {
  return useMutation({
    mutationFn: (payload: FormData) =>
      uploadsService.uploadConsultantImage(payload),
  });
}
