import { useQuery } from '@tanstack/react-query';
import { homeService } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export const useStats = () => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['stats', i18n.language],
    queryFn: () => homeService.getStats(i18n.language),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
