import { useQuery } from '@tanstack/react-query';
import { consultantService } from '@/lib/api';

export function useConsultantCount() {
  return useQuery({
    queryKey: ['consultantCount'],
    queryFn: () => consultantService.getConsultantCount(),
  });
}
