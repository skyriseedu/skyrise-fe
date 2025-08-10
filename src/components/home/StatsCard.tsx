interface StatsCardProps {
  title: string;
  count: string;
  description?: string;
}

export default function StatsCard({ title, count, description }: StatsCardProps) {
  const formattedTitle = title === 'Student Consultants' 
    ? (
      <>
        <span className="block md:hidden">Student<br />Consultants</span>
        <span className="hidden md:block">{title}</span>
      </>
    )
    : title;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">
        <h3 className="text-h2 font-medium text-text-primary">{formattedTitle}</h3>
        <div className="text-h-xl mt-4 font-bold text-text-primary">{count}</div>
      </div>
      <p className="text-body-4 lg:text-h1 text-text-secondary max-w-[280px]">{description}</p>
    </div>
  );
}