import { useQuery } from '@tanstack/react-query';
import { universityService } from '@/lib/api';
import type { UseBlogsParams } from '@/types/users/blog';
import { universityKeys } from './queryKeys';

export function useUniversities(params: UseBlogsParams = {}) {
  const { category, page = 1, limit = 5 } = params;

  return useQuery({
    queryKey: universityKeys.list({ category, page, limit }),
    queryFn: () => universityService.getUniversities({ page, limit }),
  });
}

export function useUniversityBySlug(slug: string) {
  return useQuery({
    queryKey: universityKeys.detail(slug),
    queryFn: () => universityService.getUniversityBySlug(slug),
    enabled: !!slug,
  });
}
