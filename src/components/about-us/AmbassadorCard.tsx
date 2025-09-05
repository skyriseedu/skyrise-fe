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
      className={`relative flex-shrink-0 border-1 border-gray-100 overflow-hidden rounded-[20px] shadow-lg w-[180px] h-[229px] md:w-[282px] md:h-[397px] lg:w-[212px] lg:h-[277px] ${className}`}
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
          <h3 className="text-h4 lg:text-h3 text-white mb-2 font-semibold">{name}</h3>
          <p className="text-h6 lg:text-h5 text-white/95 mb-2 font-semibold">{department}</p>
          <p className="text-h6 lg:text-h5 text-white font-semibold">{university}</p>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorCard;
