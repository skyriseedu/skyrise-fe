import { useQuery } from '@tanstack/react-query';
import { consultantsService } from '@/lib/api';
import { consultantKeys } from './queryKeys';

export function useConsultants() {
  return useQuery({
    queryKey: consultantKeys.list(),
    queryFn: () => consultantsService.getConsultants(),
  });
}
