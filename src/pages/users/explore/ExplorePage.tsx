import ProgramCard from '@/components/explore/ProgramCard';
import MobileFilter from '@/components/explore/MobileFilter';
import DesktopFilterDropdown from '@/components/explore/DesktopFilterDropdown';
import StickyHeader from '@/components/common/StickyHeader';
import Pagination from '@/components/common/Pagination';
import Loading from '@/components/common/Loading';
import type { ExploreFilters } from '@/types/users/explore';
import React, { useState, useMemo, useEffect } from 'react';
import filterIcon from '@/assets/filter-alt.svg';
import searchIcon from '@/assets/search.svg';
import { useFilterStore } from '@/store/useFilterStore';
import { usePrograms, useProgramsSearch } from '@/queries';
import { capitalizeFirstLetters } from '@/helpers';
import { useProgramOptionsStore } from '@/store/useProgramOptionsStore';
import ApplicationForm from '@/components/common/ApplicationForm';
import SuccessModal from '@/components/common/SuccessModal';

const ITEMS_PER_PAGE = 10;

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { isMobileFilterOpen, setIsMobileFilterOpen } = useFilterStore();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filters, setFilters] = useState<ExploreFilters>({
    degrees: [],
    programs: [],
    tuitionRanges: [],
    duration: [],
  });
  const {
    degrees: degreeOpts,
    programs: programOpts,
    durations: durationOpts,
    fees: feeOpts,
    fetchFilters,
    fetched,
    loading: loadingFilters,
  } = useProgramOptionsStore();
  
  useEffect(() => {
    if (!fetched && !loadingFilters) fetchFilters();
  }, [fetched, loadingFilters, fetchFilters]);
  const listQuery = usePrograms({ page: currentPage, limit: ITEMS_PER_PAGE });

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 250);
    return () => clearTimeout(id);
  }, [searchQuery]);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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

  const labelMaps = useMemo(() => {
    const deg = new Map<string, string>();
    const prog = new Map<string, string>();
    const dur = new Map<string, string>();
    const fees = new Map<string, string>();
    degreeOpts.forEach((o) => deg.set(o.value, o.label));
    programOpts.forEach((o) => prog.set(o.value, o.label));
    durationOpts.forEach((o) => dur.set(o.value, o.label));
    feeOpts.forEach((o) => fees.set(o.value, o.label));
    return { deg, prog, dur, fees };
  }, [degreeOpts, programOpts, durationOpts, feeOpts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyClick = () => setIsApplicationOpen(true);
  const handleFormSuccess = () => {
    setIsApplicationOpen(false);
    setShowSuccessModal(true);
  };

  const usingSearch = hasActiveFilters || !!debouncedSearch;
  const searchParams = useMemo(() => {
    if (!usingSearch) return null;
    const degree = filters.degrees[0]
      ? labelMaps.deg.get(filters.degrees[0]) ||
        capitalizeFirstLetters(filters.degrees[0].replace(/-/g, ' '))
      : undefined;
    const programsParam = filters.programs.length
      ? filters.programs.map(
          (p) => labelMaps.prog.get(p) || capitalizeFirstLetters(p.replace(/-/g, ' '))
        )
      : undefined;
    const feesParam = filters.tuitionRanges.length
      ? filters.tuitionRanges
      : undefined;
    const durationParam = filters.duration.length
      ? filters.duration.map((d) => {
          const match = d.match(/[0-9]+(\.[0-9]+)?/);
          return match ? match[0] : d;
        })
      : undefined;
    const q = debouncedSearch || undefined;
    return { degree, programs: programsParam, fees: feesParam, duration: durationParam, q };
  }, [usingSearch, filters, debouncedSearch, labelMaps]);

  const searchQueryResult = useProgramsSearch(
    {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      ...(searchParams || {}),
    },
    usingSearch
  );

  const data = usingSearch ? searchQueryResult.data : listQuery.data;
  const isLoading = usingSearch
    ? searchQueryResult.isLoading
    : listQuery.isLoading;
  const isError = usingSearch ? searchQueryResult.isError : listQuery.isError;
  const error = usingSearch ? searchQueryResult.error : listQuery.error;

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
        slug: p.slug,
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

  const filteredPrograms = useMemo(() => {
    if (usingSearch) return mappedPrograms; 
    const q = debouncedSearch.toLowerCase();

    const matchesDegree = (raw: any) => {
      if (!filters.degrees.length) return true;
      const deg = (raw?.keyInformation?.degree || '').toString().toLowerCase();
      return filters.degrees.includes(deg);
    };

    const paired = mappedPrograms?.map((m, i) => ({ m, raw: allPrograms[i] }));

    const textFiltered = debouncedSearch
      ? paired.filter(({ m }) => (m.title || '')?.toLowerCase()?.includes(q))
      : paired;

    const structured = textFiltered?.filter(({ raw }) => matchesDegree(raw));

    return structured?.map(({ m }) => m);
  }, [usingSearch, debouncedSearch, mappedPrograms, allPrograms, filters]);

  const totalPages = useMemo(() => {
    const rootPagination = (data as any)?.pagination;
    if (rootPagination?.pages) return rootPagination.pages;
    const nested = (data as any)?.data?.pagination;
    if (nested?.totalPages) return nested.totalPages;
    const totalCount =
      (data as any)?.total ?? nested?.totalPrograms ?? mappedPrograms.length;
    return Math.max(1, Math.ceil((totalCount || 0) / ITEMS_PER_PAGE));
  }, [data, mappedPrograms]);

  const totalCount = useMemo(() => {
    return (data as any)?.total ?? mappedPrograms.length;
  }, [data, mappedPrograms]);

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
                  Total {totalCount} Programs Found
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
                      {labelMaps.deg.get(degree) ||
                        capitalizeFirstLetters(degree.replace(/-/g, ' '))}
                    </span>
                  ))}
                  {filters.programs.map((program) => (
                    <span
                      key={program}
                      className="bg-secondary text-body-5 text-text-primary inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium"
                    >
                      {labelMaps.prog.get(program) ||
                        capitalizeFirstLetters(program.replace(/-/g, ' '))}
                    </span>
                  ))}
                  {filters.duration.map((duration) => (
                    <span
                      key={duration}
                      className="bg-secondary text-body-5 text-text-primary inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium"
                    >
                      {labelMaps.dur.get(duration) || duration}
                    </span>
                  ))}
                  {filters.tuitionRanges.map((range) => (
                    <span
                      key={range}
                      className="bg-secondary text-body-5 text-text-primary inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium"
                    >
                      {labelMaps.fees.get(range) ||
                        capitalizeFirstLetters(range.replace(/-/g, ' '))}
                    </span>
                  ))}
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
              ) : filteredPrograms?.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-primary text-h3 font-semibold">
                    0 PROGRAM FOUND
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    {filteredPrograms.map((program) => (
                  <ProgramCard
                    key={program.id}
                    slug={(program as any).slug}
                    title={program.title}
                    university={program.university}
                    upcomingIntake={program.upcomingIntake}
                    duration={program.duration}
                    ranking={program.ranking}
                    rankingYear={program.rankingYear}
                    totalTuitionFees={program.totalTuitionFees}
                    applicationDeadline={program.applicationDeadline}
                    id={program.id}
                    onApplyClick={handleApplyClick}
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
          mobilePadding="px-6"
          desktopPadding="lg:px-15"
          useContainer={false}
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
                  Total {totalCount} Programs Found
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
            ) : filteredPrograms.length === 0 ? (
              <div className="flex h-[450px] items-center justify-center">
                <p className="text-primary text-h2 font-semibold">
                  0 PROGRAM FOUND
                </p>
              </div>
            ) : (
              <>
                <div className="scrollbar-hide relative h-[450px] overflow-y-auto">
                  <div className="flex flex-col gap-4 pb-20">
                    {filteredPrograms.map((program) => (
                      <ProgramCard
                        key={program.id}
                        slug={(program as any).slug}
                        title={program.title}
                        university={program.university}
                        upcomingIntake={program.upcomingIntake}
                        duration={program.duration}
                        ranking={program.ranking}
                        rankingYear={program.rankingYear}
                        totalTuitionFees={program.totalTuitionFees}
                        applicationDeadline={program.applicationDeadline}
                        id={program.id}
                        onApplyClick={handleApplyClick}
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

      {/* Application Form Modal */}
      {isApplicationOpen && (
        <div
          className="fixed inset-0 z-60 flex items-start justify-center bg-black/40 pt-25"
          onClick={() => setIsApplicationOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <ApplicationForm
              onClose={() => setIsApplicationOpen(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Applied Successfully!"
        message="Thank you for applying with us. We will contact you shortly via email to confirm your application details."
      />
    </div>
  );
};

export default ExplorePage;
