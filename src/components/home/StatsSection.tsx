import StatsCard from './StatsCard';

const statsData = [
  {
    title: 'Student Consultants',
    count: '10+',
    description:
      "We've guided countless dreamers—now it's your turn. Wherever you are, we're here to help you grow, dream bigger, and reach higher.",
  },
  {
    title: 'Programs',
    count: '10+',
    description:
      'We collected everything in one place, because your journey should start with a choice.',
  },
  {
    title: 'Universities',
    count: '10+',
    description:
      'We open doors to brighter opportunities by working closely with trusted universities nationwide.',
  },
  {
    title: 'Scholarship',
    count: '10+',
    description:
      "We're here to help you unlock scholarships and funding because everyone deserves a chance to study abroad.",
  }
];

export default function StatsSection() {
  return (
    <section className="py-9 sm:py-9 md:py-16 lg:py-16 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-10 md:gap-12">
          {statsData?.map((stat, index) => (
            <div key={index} className={`${index >= 2 ? 'md:hidden lg:block' : ''} ${index === 0 ? '-mt-[28px] md:mt-0' : ''}`}>
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