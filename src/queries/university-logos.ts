import { useQuery } from '@tanstack/react-query';
import { universityLogoService } from '@/lib/api/services/university-logos';

export function useAllUniversityLogos() {
  return useQuery({
    queryKey: ['university-logos'],
    queryFn: () => universityLogoService.getAllLogos(),
  });
}
