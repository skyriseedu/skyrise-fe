interface StatsCardProps {
  title: string;
  count: string;
  description?: string;
}

export default function StatsCard({
  title,
  count,
  description,
}: StatsCardProps) {
  const formattedTitle =
    title === 'Student Consultants' ? (
      <>
        <span className="block md:hidden">
          Student
          <br />
          Consultants
        </span>
        <span className="hidden md:block">{title}</span>
      </>
    ) : (
      title
    );

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">
        <h3 className="text-h3 text-text-primary md:text-h2 font-semibold">
          {formattedTitle}
        </h3>
        <div className="text-h1 text-text-primary mt-4 font-semibold md:text-[40px] lg:text-[48px]">
          {count}
        </div>
      </div>
      <p className="text-body-4 lg:text-body-2 text-text-secondary max-w-[280px]">
        {description}
      </p>
    </div>
  );
}
