import { useQuery } from '@tanstack/react-query';

import { ambassadorsService } from '@/lib/api';

import { ambassadorKeys } from './queryKeys';

export const useAmbassadors = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ambassadorKeys.paginated(page, limit),
    queryFn: () => ambassadorsService.getAmbassadors({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
