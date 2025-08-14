import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import axiosInstance from '@/lib/axios';
import StatsCard from './StatsCard';
import Loading from '../common/Loading';

interface StatsData {
  studentConsultants: { text: string; count: number };
  scholarship: { text: string; count: number };
  universities: { text: string; count: number };
  programs: { text: string; count: number };
  reviews: { text: string; count: number };
}

export default function StatsSection() {
  const { i18n, t } = useTranslation();
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isServerError, setIsServerError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/overview', {
          params: { lang: i18n.language }
        });
        
        console.log(response.data);
        if (response.data.success && response.data.data) {
          setStatsData(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 500) {
            setIsServerError(true);
          }
          const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
          setError(errorMessage);
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [i18n.language]);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error || !statsData) {
    if (isServerError) {
      return (
        <section className="bg-white px-4 py-9 sm:py-9 md:py-16 lg:py-16">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-gray-600">Something went wrong..</p>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  const stats = [
    {
      title: t('home.stats.studentConsultants.title'),
      count: `${statsData.studentConsultants.count}+`,
      description: statsData.studentConsultants.text,
    },
    {
      title: t('home.stats.programs.title'),
      count: `${statsData.programs.count}+`,
      description: statsData.programs.text,
    },
    {
      title: t('home.stats.universities.title'),
      count: `${statsData.universities.count}+`,
      description: statsData.universities.text,
    },
    {
      title: t('home.stats.scholarship.title'),
      count: `${statsData.scholarship.count}+`,
      description: statsData.scholarship.text,
    },
  ];

  return (
    <section className="bg-white px-4 py-9 sm:py-9 md:py-16 lg:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 sm:gap-10 md:grid-cols-4 md:gap-12 lg:grid-cols-4">
          {stats?.map((stat, index) => (
            <div
              key={index}
              className={`${index >= 2 ? 'md:hidden lg:block' : ''} ${index === 0 ? '-mt-[28px] md:mt-0' : ''}`}
            >
              <StatsCard
                title={stat.title}
                count={stat.count}
                description={stat.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
