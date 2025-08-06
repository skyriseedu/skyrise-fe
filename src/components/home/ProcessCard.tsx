import ellipseIcon from '@/assets/ellipse.svg';

interface ProcessCardProps {
  number: number;
  title: string;
}

export const ProcessCard = ({ number, title }: ProcessCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4 w-24 h-[120px]">
        <img 
          src={ellipseIcon} 
          alt="" 
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'opacity(0.6)' }}
        />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary rounded-full border-4 border-white flex items-center justify-center">
          <span className="text-3xl font-semibold text-white">{number}</span>
        </div>
      </div>
      <div className="h-2 w-2 rounded-full bg-primary mb-4"></div>
    </div>
  );
};