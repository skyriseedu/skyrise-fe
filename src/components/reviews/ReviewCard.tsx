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
    <div className="relative cursor-pointer">
      <div className="absolute -top-10 left-6 z-10 h-20 w-20 overflow-hidden rounded-full bg-gray-300 md:h-24 md:w-24">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-400" />
        )}
      </div>

      <div className="mt-8 h-auto min-h-[350px] overflow-hidden rounded-[20px] bg-secondary px-4 pt-4 pb-6 shadow-lg md:min-h-[260px] md:px-6">
        <div className="mb-4 flex items-start gap-3 md:gap-4">
          <div className="w-20 flex-shrink-0 md:w-24" />
          <div className="min-w-0 flex-1">
            <h3 className="text-body-1 font-semibold break-words text-[var(--color-text-primary)] md:text-xl">
              {name}
            </h3>
            <p className="mt-1 text-body-4 break-words text-text-secondary md:text-sm">
              {program}
            </p>
          </div>
        </div>

        <div className="relative px-2 md:px-4">
          <img
            src={reviewIcon}
            alt="Quote"
            className="absolute -top-4 -left-2 h-5 w-4 md:h-6 md:w-5"
          />
          <p className="text-body-2 leading-relaxed break-words text-[var(--color-text-primary)] md:text-sm">
            {testimonial}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
