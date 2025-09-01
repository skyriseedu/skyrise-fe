import ProgramCard from '@/components/explore/ProgramCard';
import MobileFilter from '@/components/explore/MobileFilter';
import DesktopFilterDropdown from '@/components/explore/DesktopFilterDropdown';
import StickyHeader from '@/components/common/StickyHeader';
import type { ExploreFilters } from '@/types/users/explore';
import React, { useState, useMemo } from 'react';
import filterIcon from '@/assets/filter-alt.svg';
import searchIcon from '@/assets/search.svg';
import { useFilter } from '@/contexts/FilterContext';

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobileFilterOpen, setIsMobileFilterOpen } = useFilter();
  const [filters, setFilters] = useState<ExploreFilters>({
    degrees: [],
    programs: [],
    tuitionRanges: [],
    duration: [],
  });

  const samplePrograms = [
    {
      id: '1',
      title: 'Bachelor of Science in Information and Communication Technology',
      university: 'Rangsit University',
      upcomingIntake: 'Aug 2025',
      duration: '4 years',
      ranking: 'Public, 20th',
      rankingYear: '2025',
      totalTuitionFees: '600,000 THB',
      applicationDeadline: 'July 23, 2025',
      degree: 'bachelor',
      program: 'it',
      tuition: 600000,
    }
  ];

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.degrees.length > 0) count += filters.degrees.length;
    if (filters.programs.length > 0) count += filters.programs.length;
    if (filters.duration.length > 0) count += filters.duration.length;
    if (filters.tuitionRanges.length > 0) count += filters.tuitionRanges.length;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  const handleClearFilters = () => {
    setFilters({
      degrees: [],
      programs: [],
      tuitionRanges: [],
      duration: [],
    });
  };

  return (
    <div className="min-h-screen md:bg-secondary sm:bg-white">
      {/* Mobile Layout */}
      <div className="lg:hidden relative">
        {/* Sticky Header Section */}
        <div className="sticky top-[82px] z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <h1 className="text-h2 font-fustat sm:text-h1 mb-4">Explore</h1>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-body-2 font-semibold text-text-primary">
                Total {samplePrograms.length} Programs Found
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 cursor-pointer transition-colors"
                >
                  <img src={filterIcon} alt="Filter" className="h-4 w-4" />
                  <span className="text-body-3">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-body-5 text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <img src={searchIcon} alt="Search" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50" />
              <input
                type="search"
                placeholder="Search Programs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>

            {hasActiveFilters && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {filters.degrees.map((degree) => (
                    <span
                      key={degree}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-body-5 font-medium text-text-primary"
                    >
                      {degree.charAt(0).toUpperCase() + degree.slice(1)}
                    </span>
                  ))}
                  {filters.programs.map((program) => {
                    const programLabels: Record<string, string> = {
                      'it': 'Information and Communication Technology',
                      'business': 'Business Administration',
                      'engineering': 'Engineering',
                      'medicine': 'Medicine'
                    };
                    return (
                      <span
                        key={program}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-body-5 font-medium text-text-primary"
                      >
                        {programLabels[program] || program}
                      </span>
                    );
                  })}
                  {filters.duration.map((duration) => (
                    <span
                      key={duration}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-body-5 font-medium text-text-primary"
                    >
                      {duration} year{duration !== '1' ? 's' : ''}
                    </span>
                  ))}
                  {filters.tuitionRanges.map((range) => {
                    const rangeLabel = {
                      '0-200000': '0 - 200,000 THB',
                      '200000-400000': '200,000 - 400,000 THB',
                      '400000-600000': '400,000 - 600,000 THB',
                      '600000-800000': '600,000 - 800,000 THB',
                      '800000+': '800,000+ THB'
                    }[range];
                    return (
                      <span
                        key={range}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-body-5 font-medium text-text-primary"
                      >
                        {rangeLabel}
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={handleClearFilters}
                  className="m-2 mt-5 cursor-pointer text-body-5  text-primary underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 pt-4 pb-8">
          <div className="flex flex-col gap-4">
            {samplePrograms.map((program) => (
              <ProgramCard
                key={program.id}
                {...program}
                onApplyClick={() => console.log('Apply clicked')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block relative">
        <StickyHeader 
          title="Explore" 
          showBackButton={false}
          desktopPadding="px-0"
          mobilePadding="px-0"
        />
        
        <div className="flex">
          <div className="w-2/8 bg-secondary pl-8">
            <DesktopFilterDropdown
              filters={filters}
              onApplyFilters={setFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-6/8 bg-white px-8 py-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-h2 font-semibold text-text-primary">
                Total {samplePrograms.length} Programs Found
              </p>
              
              <div className="relative w-96">
                <img src={searchIcon} alt="Search" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50" />
                <input
                  type="search"
                  placeholder="Search Programs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>


            <div className="flex flex-col gap-4">
              {samplePrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  {...program}
                  onApplyClick={() => console.log('Apply clicked')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileFilter
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
};

export default ExplorePage;