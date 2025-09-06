import React from 'react';
import { useParams } from 'react-router-dom';
import type { University } from '@/types/users/university';

// Mock data - this would normally come from an API
const mockUniversity: University = {
  id: '1',
  name: 'Rangsit University',
  location: 'Thailand',
  country: 'Thailand',
  image: '/api/placeholder/800/400',
  ranking: 2025,
  description:
    'Rangsit University is a leading private university in Thailand, known for its excellence in education, research, and innovation. The university offers a wide range of undergraduate and graduate programs across various disciplines.',
  programs: [
    'Business Administration',
    'Engineering',
    'Medicine',
    'Arts and Design',
    'Computer Science',
    'Law',
  ],
  tuitionFee: {
    min: 200000,
    max: 400000,
    currency: '฿',
  },
  acceptanceRate: 65,
  establishedYear: 1990,
  website: 'https://www.rsu.ac.th',
  tags: ['Private', 'Research', 'International'],
};

const UniversityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // In a real app, you'd fetch the university data based on the ID
  // For now, we'll use the mock data regardless of the ID
  const university = mockUniversity;

  console.log('University ID:', id); // This would be used for fetching real data

  if (!university) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            University Not Found
          </h2>
          <p className="text-gray-600">
            The university you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={university.image}
          alt={`${university.name} campus`}
          className="h-full w-full object-cover"
        />
        <div className="bg-opacity-40 absolute inset-0 bg-black" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {university.name}
            </h1>
            <div className="flex items-center justify-center text-xl">
              <svg
                className="mr-2 h-6 w-6"
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
                {university.location}, {university.country}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* About */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                About {university.name}
              </h2>
              <p className="leading-relaxed text-gray-600">
                {university.description}
              </p>
            </div>

            {/* Programs */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Programs Offered
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {university.programs.map((program, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-lg bg-gray-50 p-3"
                  >
                    <svg
                      className="text-primary mr-3 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium text-gray-900">{program}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Quick Facts
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Established</span>
                  <span className="font-semibold">
                    {university.establishedYear}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ranking</span>
                  <span className="font-semibold">#{university.ranking}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Acceptance Rate</span>
                  <span className="font-semibold">
                    {university.acceptanceRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Tuition</span>
                  <span className="font-semibold">
                    {university.tuitionFee.currency}
                    {university.tuitionFee.min.toLocaleString()} -{' '}
                    {university.tuitionFee.currency}
                    {university.tuitionFee.max.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {university.tags && (
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {university.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="space-y-3">
                <button className="bg-primary hover:bg-primary/90 w-full rounded-lg px-4 py-3 font-medium text-white transition-colors duration-200">
                  Apply Now
                </button>
                <button className="w-full rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200">
                  Download Brochure
                </button>
                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetail;
