import ellipseIcon from '@/assets/ellipse.svg';
import rectangleIcon from '@/assets/rectangle.svg';

interface AdmissionStepCardProps {
  number: number;
  title: string;
}

const AdmissionStepCard = ({ number, title }: AdmissionStepCardProps) => {
  return (
    <div className="flex flex-col items-center w-40 sm:w-44 md:w-56 lg:w-64">
      <div className="relative mb-2 w-12 h-16 md:mb-3 md:w-14 md:h-18">
        <img 
          src={ellipseIcon} 
          alt="ellipse" 
          className="absolute inset-0 w-20 h-full md:w-24 opacity-50"
        />
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-8 md:top-2 md:w-10 md:h-10 bg-primary rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-h4 md:text-h3 font-semibold text-white">{number}</span>
        </div>
      </div>
      
      <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary mb-2 md:mb-3"></div>
      
      <div className="relative w-40 h-16 sm:w-44 sm:h-18 md:w-56 md:h-20 lg:w-64 lg:h-24 flex items-center justify-center">
        <img 
          src={rectangleIcon} 
          alt="rectangle" 
          className="absolute inset-0 w-full h-full object-fill"
        />
        <span className="relative z-10 text-white sm:text-body-5 lg:text-body-2 font-medium px-2 sm:px-4 md:px-6 text-center leading-tight whitespace-pre-line">
          {title}
        </span>
      </div>
    </div>
  );
};

export default AdmissionStepCard;