import React, { useState } from 'react';
import type { Consultant } from '@/types/users/consultant';

// Mock data - replace with real data later
const mockConsultants: Consultant[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Senior Education Consultant',
    company: 'Global Education Partners',
    image: '/api/placeholder/150/150',
    specialization: [
      'University Applications',
      'Scholarship Guidance',
      'Career Planning',
    ],
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    location: 'Bangkok, Thailand',
    languages: ['English', 'Thai'],
    description:
      'Experienced education consultant specializing in international university applications and scholarship opportunities.',
    price: {
      amount: 150,
      currency: '$',
      per: 'hour',
    },
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    tags: ['Expert', 'Top Rated'],
  },
  // Add more mock consultants as needed
];

const ConsultantTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [consultants] = useState<Consultant[]>(mockConsultants);

  const totalConsultants = consultants.length;

  const handleViewProfile = (consultant: Consultant) => {
    console.log('View profile for:', consultant.name);
  };

  const handleBookConsultation = (consultant: Consultant) => {
    console.log('Book consultation with:', consultant.name);
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium text-gray-900">
          Total Consultants {totalConsultants}
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search Consultant"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="focus:ring-primary focus:border-primary block w-full rounded-lg border border-gray-300 bg-white py-3 pr-3 pl-10 leading-5 placeholder-gray-500 focus:placeholder-gray-400 focus:ring-1 focus:outline-none"
        />
      </div>

      {/* Consultant Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {consultants.map((consultant) => (
          <div
            key={consultant.id}
            className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            {/* Consultant Avatar */}
            <div className="p-6 text-center">
              <img
                src={consultant.image}
                alt={consultant.name}
                className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
              />
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                {consultant.name}
              </h3>
              <p className="mb-2 text-sm text-gray-600">{consultant.title}</p>
              <p className="text-xs text-gray-500">{consultant.company}</p>
            </div>

            {/* Consultant Info */}
            <div className="px-6 pb-6">
              {/* Rating and Experience */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm font-medium">
                    {consultant.rating}
                  </span>
                  <span className="ml-1 text-xs text-gray-500">
                    ({consultant.reviewCount})
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {consultant.experience} years exp.
                </span>
              </div>

              {/* Specialization Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {consultant.specialization.slice(0, 2).map((spec, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                    >
                      {spec}
                    </span>
                  ))}
                  {consultant.specialization.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{consultant.specialization.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 text-center">
                <span className="text-primary text-lg font-bold">
                  {consultant.price.currency}
                  {consultant.price.amount}
                </span>
                <span className="text-sm text-gray-600">
                  /{consultant.price.per}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleViewProfile(consultant)}
                  className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleBookConsultation(consultant)}
                  className="bg-primary hover:bg-primary/90 flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {consultants.length > 0 && (
        <div className="flex justify-center">
          <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50">
            Load More Consultants
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultantTab;
