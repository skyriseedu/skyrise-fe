import ProgramCard from '@/components/explore/ProgramCard';
import React from 'react';

const ExplorePage: React.FC = () => {
  const sampleProgram = {
    title: 'Bachelor of Science in Information and Communication Technology',
    university: 'Rangsit University',
    upcomingIntake: 'Aug 2025',
    duration: '4 years',
    ranking: 'Public, 20th',
    rankingYear: '2025',
    totalTuitionFees: '600,000 THB',
    applicationDeadline: 'July 23, 2025',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1297px] px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Explore</h1>
          <div className="mb-6 flex items-center gap-4">
            <p className="text-lg text-gray-600">Total Programs: 200</p>
            <input
              type="search"
              placeholder="Search Programs"
              className="max-w-md flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ProgramCard
            id="1"
            {...sampleProgram}
            onApplyClick={() => console.log('Apply clicked')}
          />
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
