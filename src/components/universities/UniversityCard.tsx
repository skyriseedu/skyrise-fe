import React from 'react';
import type { UniversityCardProps } from '@/types/university';

const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  onViewDetails,
  onApply,
  className = '',
}) => {
  const {
    name,
    location,
    country,
    image,
    ranking,
    description,
    tuitionFee,
    acceptanceRate,
    establishedYear,
    tags,
  } = university;

  const formatTuition = () => {
    const { min, max, currency } = tuitionFee;
    if (min === max) {
      return `${currency}${min.toLocaleString()}`;
    }
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl ${className}`}
    >
      {/* University Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`${name} campus`}
          className="h-full w-full object-cover"
        />
        {ranking && (
          <div className="bg-primary absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-semibold text-white">
            #{ranking} Ranked
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* University Info */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900">
            {name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="mr-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {location}, {country}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-3 text-sm text-gray-600">{description}</p>

        {/* University Stats */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-primary text-lg font-bold">
              {formatTuition()}
            </div>
            <div className="text-xs text-gray-600">Annual Tuition</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-primary text-lg font-bold">
              {acceptanceRate ? `${acceptanceRate}%` : 'N/A'}
            </div>
            <div className="text-xs text-gray-600">Acceptance Rate</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>Est. {establishedYear}</span>
          {tags && tags.length > 2 && <span>+{tags.length - 2} more tags</span>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails?.(university)}
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
          >
            View Details
          </button>
          <button
            onClick={() => onApply?.(university)}
            className="bg-primary hover:bg-primary/90 flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
