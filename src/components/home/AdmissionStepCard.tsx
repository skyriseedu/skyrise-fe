import ellipseIcon from '@/assets/ellipse.svg';
import rectangleIcon from '@/assets/rectangle.svg';

interface AdmissionStepCardProps {
  number: number;
  title: string;
}

const AdmissionStepCard = ({ number, title }: AdmissionStepCardProps) => {
  return (
    <div className="flex w-40 flex-col items-center sm:w-44 md:w-56 lg:w-64">
      <div className="relative mb-2 h-16 w-12 md:mb-3 md:h-18 md:w-14">
        <img
          src={ellipseIcon}
          alt="ellipse"
          className="absolute inset-0 h-full w-20 opacity-50 md:w-24"
        />
        <div className="bg-primary absolute top-1.5 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white md:top-2 md:h-10 md:w-10">
          <span className="text-h4 md:text-h3 font-semibold text-white">
            {number}
          </span>
        </div>
      </div>

      <div className="bg-primary mb-2 h-1.5 w-1.5 rounded-full md:mb-3 md:h-2 md:w-2"></div>

      <div className="relative flex h-16 w-40 items-center justify-center sm:h-18 sm:w-44 md:h-20 md:w-56 lg:h-24 lg:w-64">
        <img
          src={rectangleIcon}
          alt="rectangle"
          className="absolute inset-0 h-full w-full object-fill"
        />
        <span className="text-body-5 lg:text-body-3 relative z-10 px-2 text-center leading-tight font-semibold whitespace-pre-line text-white sm:px-4 md:px-6">
          {title}
        </span>
      </div>
    </div>
  );
};

export default AdmissionStepCard;
