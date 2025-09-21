import { useQuery } from '@tanstack/react-query';
import { universityService } from '@/lib/api';
import type {
  GetAllUniversitiesRequest,
  SearchUniversitiesRequest,
} from '@/types/users/university';
import { universityKeys } from './queryKeys';

export function useAllUniversities(params: GetAllUniversitiesRequest = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: universityKeys.list({ page, limit }),
    queryFn: () => universityService.getAllUniversities({ page, limit }),
  });
}

export function useSearchUniversities(params: SearchUniversitiesRequest = {}) {
  const { q, universityType, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: universityKeys.search({ q, universityType, page, limit }),
    queryFn: () =>
      universityService.searchUniversities({ q, universityType, page, limit }),
    enabled: !!(q || universityType), // Only search if there's a query or filter
  });
}

export function useUniversityBySlug(slug: string) {
  return useQuery({
    queryKey: universityKeys.detail(slug),
    queryFn: () => universityService.getUniversityBySlug(slug),
    enabled: !!slug,
  });
}
