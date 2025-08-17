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
      <div className="absolute -top-10 left-6 z-10 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-300">
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

      <div className="bg-[#FCE8EC] rounded-[20px] pt-4 pb-6 px-4 md:px-6 mt-8 h-auto min-h-[280px] md:min-h-[260px] shadow-lg overflow-hidden">
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <div className="w-20 md:w-24 flex-shrink-0" /> 
          <div className="min-w-0 flex-1">
            <h3 className="text-base md:text-xl font-semibold text-[var(--color-text-primary)] break-words">
              {name}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
              {program}
            </p>
          </div>
        </div>

        <div className="relative px-2 md:px-4">
          <img 
            src={reviewIcon} 
            alt="Quote" 
            className="absolute -top-4 -left-2 w-4 md:w-5 h-5 md:h-6"
          />
          <p className="text-xs md:text-sm leading-relaxed text-[var(--color-text-primary)] break-words">
            {testimonial}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;