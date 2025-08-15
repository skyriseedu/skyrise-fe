import React from 'react';
import reviewIcon from '@/assets/review.svg';

interface ReviewCardProps {
  name: string;
  program: string;
  testimonial: string;
  imageUrl?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  program,
  testimonial,
  imageUrl,
}) => {
  return (
    <div className="relative">
      <div className="absolute -top-12 left-8 md:left-12 z-10">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-300">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400" />
          )}
        </div>
      </div>

      <div className="bg-[var(--color-secondary)] rounded-[20px] pt-16 pb-8 md:pb-12 px-6 md:px-12 mt-12 min-h-[400px] md:min-h-[500px]">
        <div className="flex items-start gap-4 md:gap-8 mb-8">
          <div className="w-32 md:w-48 flex-shrink-0" />
          
          <div className="-mt-8 md:pt-16">
            <h3 className="text-h2 md:text-h1 font-semibold text-[var(--color-text-primary)] mb-1 md:mb-2">
              {name}
            </h3>
            <p className="text-body-4 md:text-body-2 text-[var(--color-text-primary)]">
              {program}
            </p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative px-4 md:pl-12 md:pr-0">
          <img 
            src={reviewIcon} 
            alt="Quote" 
            className="absolute -top-8 -left-2 w-8 h-8"
          />
          <p className="text-body-3 md:text-h3 text-[var(--color-text-primary)] leading-[1.6]">
            {testimonial}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;