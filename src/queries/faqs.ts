import { useQuery } from '@tanstack/react-query';

import { faqsService } from '@/lib/api';

import { faqKeys } from './queryKeys';

export const useFaqs = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: faqKeys.paginated(page, limit),
    queryFn: () => faqsService.getFaqs({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
