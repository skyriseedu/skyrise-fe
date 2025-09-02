import ProgramCard from '@/components/explore/ProgramCard';
import MobileFilter from '@/components/explore/MobileFilter';
import DesktopFilterDropdown from '@/components/explore/DesktopFilterDropdown';
import StickyHeader from '@/components/common/StickyHeader';
import Pagination from '@/components/common/Pagination';
import type { ExploreFilters } from '@/types/users/explore';
import React, { useState, useMemo } from 'react';
import filterIcon from '@/assets/filter-alt.svg';
import searchIcon from '@/assets/search.svg';
import { useFilterStore } from '@/store/useFilterStore';

const ITEMS_PER_PAGE = 8;

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { isMobileFilterOpen, setIsMobileFilterOpen } = useFilterStore();
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
    },
    {
      id: '2',
      title: 'Bachelor of Business Administration',
      university: 'Chulalongkorn University',
      upcomingIntake: 'Sep 2025',
      duration: '4 years',
      ranking: 'Public, 1st',
      rankingYear: '2025',
      totalTuitionFees: '800,000 THB',
      applicationDeadline: 'August 15, 2025',
      degree: 'bachelor',
      program: 'business',
      tuition: 800000,
    },
    {
      id: '3',
      title: 'Master of Engineering in Software Engineering',
      university: 'Mahidol University',
      upcomingIntake: 'Jan 2026',
      duration: '2 years',
      ranking: 'Public, 5th',
      rankingYear: '2025',
      totalTuitionFees: '450,000 THB',
      applicationDeadline: 'December 1, 2025',
      degree: 'master',
      program: 'engineering',
      tuition: 450000,
    },
    {
      id: '4',
      title: 'Bachelor of Medicine',
      university: 'Siriraj Hospital Medical School',
      upcomingIntake: 'June 2025',
      duration: '6 years',
      ranking: 'Public, 2nd',
      rankingYear: '2025',
      totalTuitionFees: '1,200,000 THB',
      applicationDeadline: 'May 1, 2025',
      degree: 'bachelor',
      program: 'medicine',
      tuition: 1200000,
    },
    {
      id: '5',
      title: 'Master of Business Administration (International Program)',
      university: 'Thammasat University',
      upcomingIntake: 'Aug 2025',
      duration: '2 years',
      ranking: 'Public, 8th',
      rankingYear: '2025',
      totalTuitionFees: '550,000 THB',
      applicationDeadline: 'June 30, 2025',
      degree: 'master',
      program: 'business',
      tuition: 550000,
    },
    {
      id: '6',
      title: 'Bachelor of Engineering in Computer Engineering',
      university: "King Mongkut's University of Technology Thonburi",
      upcomingIntake: 'Aug 2025',
      duration: '4 years',
      ranking: 'Public, 12th',
      rankingYear: '2025',
      totalTuitionFees: '520,000 THB',
      applicationDeadline: 'July 15, 2025',
      degree: 'bachelor',
      program: 'engineering',
      tuition: 520000,
    },
    {
      id: '7',
      title: 'Master of Science in Data Science',
      university: 'Chiang Mai University',
      upcomingIntake: 'Jan 2026',
      duration: '2 years',
      ranking: 'Public, 7th',
      rankingYear: '2025',
      totalTuitionFees: '380,000 THB',
      applicationDeadline: 'November 30, 2025',
      degree: 'master',
      program: 'it',
      tuition: 380000,
    },
    {
      id: '8',
      title: 'Bachelor of Arts in International Business',
      university: 'Kasetsart University',
      upcomingIntake: 'Aug 2025',
      duration: '4 years',
      ranking: 'Public, 10th',
      rankingYear: '2025',
      totalTuitionFees: '480,000 THB',
      applicationDeadline: 'June 15, 2025',
      degree: 'bachelor',
      program: 'business',
      tuition: 480000,
    },
    {
      id: '9',
      title: 'Doctor of Medicine',
      university: 'Prince of Songkla University',
      upcomingIntake: 'June 2025',
      duration: '6 years',
      ranking: 'Public, 4th',
      rankingYear: '2025',
      totalTuitionFees: '1,100,000 THB',
      applicationDeadline: 'April 30, 2025',
      degree: 'bachelor',
      program: 'medicine',
      tuition: 1100000,
    },
    {
      id: '10',
      title: 'Master of Engineering in Electrical Engineering',
      university: 'Suranaree University of Technology',
      upcomingIntake: 'Jan 2026',
      duration: '2 years',
      ranking: 'Public, 15th',
      rankingYear: '2025',
      totalTuitionFees: '350,000 THB',
      applicationDeadline: 'December 15, 2025',
      degree: 'master',
      program: 'engineering',
      tuition: 350000,
    },
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
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(samplePrograms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPrograms = samplePrograms.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:bg-secondary min-h-screen sm:bg-white">
      {/* Mobile Layout */}
      <div className="relative lg:hidden">
        {/* Sticky Header Section */}
        <div className="sticky top-[82px] z-20 border-b border-gray-200 bg-white">
          <div className="px-4 py-4">
            <h1 className="text-h2 font-fustat sm:text-h1 mb-4">Explore</h1>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-body-2 text-text-primary font-semibold">
                Total {samplePrograms.length} Programs Found
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="bg-secondary flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 transition-colors"
                >
                  <img src={filterIcon} alt="Filter" className="h-4 w-4" />
                  <span className="text-body-3">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-body-5 ml-1 rounded-full px-2 py-0.5 text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                src={searchIcon}
                alt="Search"
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 opacity-50"
              />
              <input
                type="search"
                placeholder="Search Programs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
              />
            </div>

            {hasActiveFilters && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {filters.degrees.map((degree) => (
                    <span
                      key={degree}
                      className="bg-secondary text-body-5 text-text-primary inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium"
                    >
                      {degree.charAt(0).toUpperCase() + degree.slice(1)}
                    </span>
                  ))}
                  {filters.programs.map((program) => {
                    const programLabels: Record<string, string> = {
                      it: 'Information and Communication Technology',
                      business: 'Business Administration',
                      engineering: 'Engineering',
                      medicine: 'Medicine',
                    };
                    return (
                      <span
                        key={program}
                        className="bg-secondary text-body-5 text-text-primary inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium"
                      >
                        {programLabels[program] || program}
                      </span>
                    );
                  })}
                  {filters.duration.map((duration) => (
                    <span
                      key={duration}
                      className="bg-secondary text-body-5 text-text-primary inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium"
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
                      '800000+': '800,000+ THB',
                    }[range];
                    return (
                      <span
                        key={range}
                        className="bg-secondary text-body-5 text-text-primary inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium"
                      >
                        {rangeLabel}
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={handleClearFilters}
                  className="text-body-5 text-primary m-2 mt-5 cursor-pointer underline"
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
            {currentPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                {...program}
                onApplyClick={() => console.log('Apply clicked')}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative hidden lg:block">
        <StickyHeader
          title="Explore"
          showBackButton={false}
          desktopPadding="px-0"
          mobilePadding="px-0"
        />

        <div className="flex">
          <div className="bg-secondary w-2/8 pl-8">
            <DesktopFilterDropdown
              filters={filters}
              onApplyFilters={setFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>

          {/* Main Content */}
          <div className="w-6/8 bg-white px-8 py-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-h2 text-text-primary font-semibold">
                Total {samplePrograms.length} Programs Found
              </p>

              <div className="relative w-96">
                <img
                  src={searchIcon}
                  alt="Search"
                  className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 opacity-50"
                />
                <input
                  type="search"
                  placeholder="Search Programs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Desktop  */}
            <div className="scrollbar-hide relative h-[450px] overflow-y-auto">
              <div className="flex flex-col gap-4 pb-20">
                {currentPrograms.map((program) => (
                  <ProgramCard
                    key={program.id}
                    {...program}
                    onApplyClick={() => console.log('Apply clicked')}
                  />
                ))}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
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
