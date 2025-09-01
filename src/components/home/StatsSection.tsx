import { useTranslation } from 'react-i18next';
import { useStats } from '@/queries';
import StatsCard from './StatsCard';
import Loading from '../common/Loading';

export default function StatsSection() {
  const { t } = useTranslation();
  const { data: statsResponse, isLoading, error, isError } = useStats();

  if (error) {
    console.error('Error details:', error);
  }

  if (isLoading) {
    return <Loading />;
  }

  const statsData = statsResponse?.data;

  if (isError || !statsData) {
    const isServerError = error?.message?.includes('status: 500');
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
