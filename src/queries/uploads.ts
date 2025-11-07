import { useMutation } from '@tanstack/react-query';
import { uploadsService } from '@/lib/api';

export function useUploadProgramImages() {
  return useMutation({
    mutationFn: (payload: FormData) =>
      uploadsService.uploadProgramImages(payload),
  });
}
