import React from 'react';
import type { UniversityCardProps } from '@/types/users/university';

const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  onViewDetails,
  className = '',
}) => {
  const { universityName, logoImage, keyInformation, universityType } =
    university;

  return (
    <div
      className={`overflow-hidden rounded-2xl border-l-4 border-l-blue-500 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl ${className}`}
    >
      {/* University Logo and Name */}
      <div className="p-6 pb-4">
        {logoImage && (
          <div className="mb-4 flex justify-center">
            <img
              src={logoImage}
              alt={`${universityName} logo`}
              className="h-16 w-16 object-contain"
            />
          </div>
        )}
        <h3 className="mb-6 text-center text-xl font-bold text-gray-900">
          {universityName}
        </h3>
      </div>

      {/* University Info Grid */}
      <div className="px-6 pb-6">
        {/* First Row */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1 text-sm text-gray-600">University Ranking</div>
            <div className="text-lg font-bold text-gray-900">
              {keyInformation.ranking || `${universityType}, Established`}
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm text-gray-600">No. of Campus</div>
            <div className="text-lg font-bold text-gray-900">1</div>
          </div>
        </div>

        {/* Second Row */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1 text-sm text-gray-600">Programs</div>
            <div className="text-lg font-bold text-gray-900">
              {keyInformation.programs}
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm text-gray-600">Application Fees</div>
            <div className="text-lg font-bold text-gray-900">Free</div>
          </div>
        </div>

        {/* Read Details Button */}
        <button
          onClick={() => onViewDetails?.(university)}
          className="w-full rounded-lg bg-red-500 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-red-600"
        >
          Read Details
        </button>
      </div>
    </div>
  );
};

export default UniversityCard;
