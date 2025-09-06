import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UniversityCard } from './index';
import DesktopUniversityFilter from './DesktopUniversityFilter';
import Pagination from '@/components/common/Pagination';
import type { University } from '@/types/users/university';
import type { UniversityFilters } from '@/types/users/university-filters';
import filterIcon from '@/assets/filter-alt.svg';
import searchIcon from '@/assets/search.svg';
import { useAllUniversities, useSearchUniversities } from '@/queries';

const ITEMS_PER_PAGE = 10;

const UniversityTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilterDropdown, setShowMobileFilterDropdown] =
    useState(false);
  const [filters, setFilters] = useState<UniversityFilters>({
    universityType: [],
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search term - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to page 1 when search term changes
      if (searchTerm.trim() !== debouncedSearchTerm.trim()) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Determine whether to use search or get all universities
  const hasSearchCriteria =
    debouncedSearchTerm.trim() || filters.universityType.length === 1; // only if one type is selected (public or private)

  // Use search API when there are search criteria
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchUniversities({
    q: debouncedSearchTerm.trim() || undefined,
    universityType: filters.universityType[0] || undefined, // API accepts single type
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Use get all API when no search criteria
  const {
    data: allData,
    isLoading: allLoading,
    error: allError,
  } = useAllUniversities({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Determine which data to use
  const data = hasSearchCriteria ? searchData : allData;
  const isLoading = hasSearchCriteria ? searchLoading : allLoading;
  const error = hasSearchCriteria ? searchError : allError;

  const universities = data?.data?.universities || [];
  const totalUniversities = data?.total || 0;
  const totalPages = data?.pages || 1;

  // Show loading when user is typing but search hasn't triggered yet
  const isTyping = searchTerm.trim() !== debouncedSearchTerm.trim();
  const isSearching = isLoading || isTyping;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.universityType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMobileFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.universityType.length > 0)
      count += filters.universityType.length;
    return count;
  }, [filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (university: University) => {
    // Navigate to university detail page
    console.log('View details for:', university.universityName);
  };

  return (
    <div className="md:bg-secondary min-h-screen sm:bg-white">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="text-text-secondary">Loading universities...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mx-4 mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="text-red-800">
            <p className="font-medium">Error loading universities</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
          {/* Mobile Layout */}
          <div className="relative lg:hidden">
            {/* Mobile Header Section */}
            <div className="bg-white">
              <div className="px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-h3 lg:text-h1 text-text-primary font-semibold">
                    Total Universities: {totalUniversities}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setShowMobileFilterDropdown(!showMobileFilterDropdown)
                        }
                        className="bg-secondary flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 transition-colors"
                      >
                        <img
                          src={filterIcon}
                          alt="Filter"
                          className="h-4 w-4"
                        />
                        <span className="text-h4">Filters</span>
                        {activeFiltersCount > 0 && (
                          <span className="bg-primary text-body-5 ml-1 rounded-full px-2 py-0.5 text-white">
                            {activeFiltersCount}
                          </span>
                        )}
                      </button>

                      {/* Mobile Filter Dropdown */}
                      {showMobileFilterDropdown && (
                        <div
                          className="absolute top-full right-0 left-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                          style={{ touchAction: 'manipulation' }}
                        >
                          <div className="p-4">
                            <div className="space-y-2">
                              {['Public', 'Private', 'International'].map(
                                (type) => (
                                  <label
                                    key={type}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={filters.universityType.includes(
                                        type as 'Public' | 'Private'
                                      )}
                                      onChange={(e) => {
                                        const newTypes = e.target.checked
                                          ? [
                                              ...filters.universityType,
                                              type as 'Public' | 'Private',
                                            ]
                                          : filters.universityType.filter(
                                              (t) => t !== type
                                            );
                                        setFilters({
                                          ...filters,
                                          universityType: newTypes,
                                        });
                                      }}
                                      className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                    />
                                    <span className="text-body-4">{type}</span>
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={searchIcon}
                    alt="Search"
                    className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 opacity-50"
                  />
                  {isTyping && (
                    <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2">
                      <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    </div>
                  )}
                  <input
                    type="search"
                    placeholder="Search University"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 py-2 pr-10 pl-10 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Content Section */}
            <div className="px-4 pt-4 pb-8">
              {/* Loading State */}
              {isSearching && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                    <p className="text-text-secondary">
                      {isTyping ? 'Searching...' : 'Loading universities...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isSearching && (
                <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="text-red-800">
                    <p className="font-medium">Error loading universities</p>
                    <p className="text-sm">{String(error)}</p>
                  </div>
                </div>
              )}

              {/* Universities Grid */}
              {!isSearching && !error && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {universities.map((university) => (
                    <UniversityCard
                      key={university._id}
                      university={university}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isSearching && !error && universities.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-h3 text-text-secondary mb-4">
                    No universities found
                  </div>
                  <p className="text-text-secondary">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}

              {/* Pagination */}
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
          </div>{' '}
          {/* mobile layout ends here */}
          {/* Desktop Layout */}
          <div className="relative hidden lg:block">
            <div className="flex">
              <div className="bg-secondary w-2/8 pl-8">
                <DesktopUniversityFilter
                  filters={filters}
                  onApplyFilters={setFilters}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>

              {/* Main Content */}
              <div className="w-6/8 bg-white px-8 py-8">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-h2 text-text-primary font-semibold">
                    Total Universities: {totalUniversities}
                  </p>

                  <div className="relative w-96">
                    <img
                      src={searchIcon}
                      alt="Search"
                      className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 opacity-50"
                    />
                    {isTyping && (
                      <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2">
                        <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                      </div>
                    )}
                    <input
                      type="search"
                      placeholder="Search University"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 py-2 pr-10 pl-10 focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Desktop University Cards - 2 columns with scroll */}
                <div className="scrollbar-hide relative h-[450px] overflow-y-auto">
                  {/* Loading State */}
                  {isSearching && (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                        <p className="text-text-secondary">
                          {isTyping
                            ? 'Searching...'
                            : 'Loading universities...'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {error && !isSearching && (
                    <div className="flex h-full items-center justify-center">
                      <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="text-center text-red-800">
                          <p className="font-medium">
                            Error loading universities
                          </p>
                          <p className="text-sm">{String(error)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Universities Grid */}
                  {!isSearching && !error && universities.length > 0 && (
                    <div className="grid grid-cols-2 gap-6 pb-20">
                      {universities.map((university) => (
                        <UniversityCard
                          key={university._id}
                          university={university}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {!isSearching && !error && universities.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-h3 text-text-secondary mb-4">
                          No universities found
                        </div>
                        <p className="text-text-secondary">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Pagination */}
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
        </>
      )}
    </div>
  );
};

export default UniversityTab;
