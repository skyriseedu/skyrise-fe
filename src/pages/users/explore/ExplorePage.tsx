import ProgramCard from '@/components/explore/ProgramCard';
import MobileFilter from '@/components/explore/MobileFilter';
import DesktopFilterDropdown from '@/components/explore/DesktopFilterDropdown';
import StickyHeader from '@/components/common/StickyHeader';
import Pagination from '@/components/common/Pagination';
import Loading from '@/components/common/Loading';
import type { ExploreFilters } from '@/types/users/explore';
import React, { useState, useMemo } from 'react';
import filterIcon from '@/assets/filter-alt.svg';
import searchIcon from '@/assets/search.svg';
import { useFilterStore } from '@/store/useFilterStore';
import { usePrograms } from '@/queries';

const ITEMS_PER_PAGE = 10;

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
  const { data, isLoading, isError, error } = usePrograms({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

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

  const allPrograms = useMemo(() => {
    const apiPrograms = (data as any)?.data?.programs as any[] | undefined;
    if (Array.isArray(apiPrograms)) return apiPrograms;
    const flatPrograms = (data as any)?.programs as any[] | undefined;
    if (Array.isArray(flatPrograms)) return flatPrograms;
    return [];
  }, [data]);

  const mappedPrograms = useMemo(
    () =>
      allPrograms.map((p: any) => ({
        id: p.id || p._id,
        title: p.title || p.programName || 'Untitled Program',
        university: p.university || p.universityName || 'Unknown University',
        upcomingIntake:
          p.upcomingIntake ||
          (Array.isArray(p?.keyInformation?.upcomingIntake)
            ? p.keyInformation.upcomingIntake[0] || '—'
            : '—'),
        duration: p.duration || p?.keyInformation?.duration || '—',
        ranking: p.ranking || p.universityRanking || '—',
        rankingYear: p.rankingYear || '',
        totalTuitionFees:
          p.totalTuitionFees || p?.keyInformation?.totalTuitionFees || '—',
        applicationDeadline: p.applicationDeadline || '—',
      })),
    [allPrograms]
  );

  const totalPages = useMemo(() => {
    const rootPagination = (data as any)?.pagination;
    if (rootPagination?.pages) return rootPagination.pages;
    const nested = (data as any)?.data?.pagination;
    if (nested?.totalPages) return nested.totalPages;
    const totalCount =
      (data as any)?.total ?? nested?.totalPrograms ?? mappedPrograms.length;
    return Math.max(1, Math.ceil((totalCount || 0) / ITEMS_PER_PAGE));
  }, [data, mappedPrograms]);

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
            <h1 className="text-h2 sm:text-h1 mb-4 font-semibold">Explore</h1>
            <div className="mb-3 flex items-center justify-between">
              {isLoading ? (
                <div className="bg-secondary h-10 w-40 animate-pulse rounded"></div>
              ) : isError ? (
                <p className="text-body-2 text-red-600 font-semibold">
                  {(error as any)?.message || 'Failed to load programs'}
                </p>
              ) : (
                <p className="text-body-2 text-text-primary font-semibold">
                  Total {(data as any)?.total ?? mappedPrograms.length} Programs
                  Found
                </p>
              )}

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
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loading size="lg" color="primary" />
            </div>
          ) : isError ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-body-3 text-red-600">
                {(error as any)?.message || 'Failed to load programs.'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {mappedPrograms.map((program) => (
                  <ProgramCard
                    key={program.id}
                    title={program.title}
                    university={program.university}
                    upcomingIntake={program.upcomingIntake}
                    duration={program.duration}
                    ranking={program.ranking}
                    rankingYear={program.rankingYear}
                    totalTuitionFees={program.totalTuitionFees}
                    applicationDeadline={program.applicationDeadline}
                    id={program.id}
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
            </>
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
          <div className="bg-secondary w-72 flex-shrink-0 pl-4 xl:w-80 xl:pl-8">
            <DesktopFilterDropdown
              filters={filters}
              onApplyFilters={setFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white px-4 py-8 xl:px-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              {isLoading ? (
                <div className="bg-secondary h-8 w-48 animate-pulse rounded"></div>
              ) : isError ? (
                <p className="text-body-3 text-red-600">
                  {(error as any)?.message || 'Failed to load programs.'}
                </p>
              ) : (
                <p className="text-h2 text-text-primary font-semibold">
                  Total {(data as any)?.total ?? mappedPrograms.length} Programs
                  Found
                </p>
              )}

              <div className="relative w-full max-w-sm xl:max-w-md">
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
            {isLoading ? (
              <div className="flex h-[450px] items-center justify-center">
                <Loading size="lg" color="primary" />
              </div>
            ) : isError ? (
              <div className="flex h-[450px] items-center justify-center">
                <p className="text-body-3 text-red-600">
                  {(error as any)?.message || 'Failed to load programs.'}
                </p>
              </div>
            ) : (
              <>
                <div className="scrollbar-hide relative h-[450px] overflow-y-auto">
                  <div className="flex flex-col gap-4 pb-20">
                    {mappedPrograms.map((program) => (
                      <ProgramCard
                        key={program.id}
                        title={program.title}
                        university={program.university}
                        upcomingIntake={program.upcomingIntake}
                        duration={program.duration}
                        ranking={program.ranking}
                        rankingYear={program.rankingYear}
                        totalTuitionFees={program.totalTuitionFees}
                        applicationDeadline={program.applicationDeadline}
                        id={program.id}
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
              </>
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
