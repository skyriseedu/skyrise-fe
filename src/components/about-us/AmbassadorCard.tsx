import React from 'react';
import type { AmbassadorCardProps } from '@/types/users/about-us';

const AmbassadorCard: React.FC<AmbassadorCardProps> = ({
  image,
  name,
  department,
  university,
  className = '',
}) => {
  return (
    <div
      className={`relative h-[229px] w-[180px] flex-shrink-0 overflow-hidden rounded-[20px] border-1 border-gray-100 shadow-lg md:h-[397px] md:w-[282px] lg:h-[277px] lg:w-[212px] ${className}`}
    >
      <div className="h-full w-full">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white to-black mix-blend-multiply"
      />

      <div className="absolute inset-0 flex items-end">
        <div className="w-full p-6 text-center">
          <h3 className="text-h4 lg:text-h3 mb-2 font-semibold text-white">
            {name}
          </h3>
          <p className="text-h6 lg:text-h5 mb-2 font-semibold text-white/95">
            {department}
          </p>
          <p className="text-h6 lg:text-h5 font-semibold text-white">
            {university}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorCard;
