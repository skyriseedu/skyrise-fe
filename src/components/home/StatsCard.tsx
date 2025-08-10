interface StatsCardProps {
  title: string;
  count: string;
  description?: string;
}

export default function StatsCard({ title, count, description }: StatsCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">
        <h3 className="text-h2 font-medium text-text-primary">{title}</h3>
        <div className="text-h-xl mt-4 font-bold text-text-primary">{count}</div>
      </div>
      <p className="text-body-4 lg:text-h1 text-text-secondary max-w-[280px]">{description}</p>
    </div>
  );
}