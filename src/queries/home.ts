import { useQuery } from '@tanstack/react-query';
import { homeService } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export const useStats = () => {
  const { i18n } = useTranslation();
  const langCode = i18n.language?.split('-')[0];

  return useQuery({
    queryKey: ['stats', langCode],
    queryFn: () => homeService.getStats(langCode),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
