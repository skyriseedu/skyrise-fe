import React from 'react';
import Location from '../../../assets/location.svg?react';
import Building from '../../../assets/building.svg?react';
interface AccommodationCardProps {
  imageUrl: string;
  name: string;
  location: string;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  imageUrl,
  name,
  location,
}) => {
  return (
    <div
      className={`group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg`}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={
            imageUrl || 'https://placehold.co/400x300?text=Image+Not+Available'
          }
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center">
            <Building className="h-5 w-5 text-gray-900" />
          </div>
          <h3 className="lg:text-h3 text-h4 font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
            {name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <div className="flex h-5 w-5 items-center justify-center">
            <Location className="h-5 w-5" />
          </div>
          <p className="lg:text-h4 text-sm text-gray-600">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
