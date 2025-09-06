import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UniversityCard } from './index';
import DesktopUniversityFilter from './DesktopUniversityFilter';
import Pagination from '@/components/common/Pagination';
import type { University } from '@/types/university';
import type { UniversityFilters } from '@/types/university-filters';
import filterIcon from '@/assets/filter-alt.svg';
import searchIcon from '@/assets/search.svg';

const ITEMS_PER_PAGE = 10;

// Mock data - replace with real data later
const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Rangsit University',
    location: 'Thailand',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 2025,
    description:
      'Leading private university in Thailand offering world-class education and research opportunities.',
    programs: ['Business', 'Engineering', 'Medicine', 'Arts'],
    tuitionFee: { min: 200000, max: 400000, currency: '฿' },
    acceptanceRate: 65,
    establishedYear: 1990,
    tags: ['Private', 'Research'],
  },
  {
    id: '2',
    name: 'Chulalongkorn University',
    location: 'Bangkok',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 1,
    description:
      "Thailand's oldest and most prestigious university, known for academic excellence.",
    programs: ['Engineering', 'Medicine', 'Arts', 'Science'],
    tuitionFee: { min: 150000, max: 300000, currency: '฿' },
    acceptanceRate: 25,
    establishedYear: 1917,
    tags: ['Public', 'Research'],
  },
  {
    id: '3',
    name: 'Mahidol University',
    location: 'Bangkok',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 2,
    description:
      'Premier university specializing in health sciences and medical education.',
    programs: ['Medicine', 'Public Health', 'Science', 'Engineering'],
    tuitionFee: { min: 180000, max: 350000, currency: '฿' },
    acceptanceRate: 30,
    establishedYear: 1969,
    tags: ['Public', 'Research'],
  },
  {
    id: '4',
    name: 'Thammasat University',
    location: 'Bangkok',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 5,
    description:
      'Leading university in social sciences, law, and political science.',
    programs: ['Law', 'Political Science', 'Economics', 'Business'],
    tuitionFee: { min: 160000, max: 320000, currency: '฿' },
    acceptanceRate: 35,
    establishedYear: 1934,
    tags: ['Public', 'Research'],
  },
  {
    id: '5',
    name: "King Mongkut's University of Technology Thonburi",
    location: 'Bangkok',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 8,
    description: 'Top engineering and technology university in Thailand.',
    programs: ['Engineering', 'Computer Science', 'Architecture', 'Science'],
    tuitionFee: { min: 170000, max: 340000, currency: '฿' },
    acceptanceRate: 40,
    establishedYear: 1957,
    tags: ['Public', 'Research'],
  },
  {
    id: '6',
    name: 'Bangkok University',
    location: 'Bangkok',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 15,
    description:
      'Private university known for creative arts and innovative programs.',
    programs: ['Communication Arts', 'Business', 'Engineering', 'Design'],
    tuitionFee: { min: 250000, max: 450000, currency: '฿' },
    acceptanceRate: 60,
    establishedYear: 1962,
    tags: ['Private', 'International'],
  },
  {
    id: '7',
    name: 'Kasetsart University',
    location: 'Bangkok',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 6,
    description: 'Leading agricultural and natural resources university.',
    programs: ['Agriculture', 'Engineering', 'Science', 'Veterinary Medicine'],
    tuitionFee: { min: 140000, max: 280000, currency: '฿' },
    acceptanceRate: 45,
    establishedYear: 1943,
    tags: ['Public', 'Research'],
  },
  {
    id: '8',
    name: 'Chiang Mai University',
    location: 'Chiang Mai',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 10,
    description:
      'Premier university in Northern Thailand with strong research programs.',
    programs: ['Medicine', 'Engineering', 'Agriculture', 'Social Sciences'],
    tuitionFee: { min: 130000, max: 260000, currency: '฿' },
    acceptanceRate: 50,
    establishedYear: 1964,
    tags: ['Public', 'Research'],
  },
  {
    id: '9',
    name: 'Assumption University',
    location: 'Bangkok',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 20,
    description:
      'International private university with English-taught programs.',
    programs: [
      'Business',
      'International Relations',
      'Engineering',
      'Architecture',
    ],
    tuitionFee: { min: 300000, max: 500000, currency: '฿' },
    acceptanceRate: 70,
    establishedYear: 1969,
    tags: ['Private', 'International'],
  },
  {
    id: '10',
    name: 'Prince of Songkla University',
    location: 'Hat Yai',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 12,
    description:
      'Leading university in Southern Thailand with comprehensive programs.',
    programs: ['Medicine', 'Engineering', 'Natural Resources', 'Liberal Arts'],
    tuitionFee: { min: 125000, max: 250000, currency: '฿' },
    acceptanceRate: 55,
    establishedYear: 1967,
    tags: ['Public', 'Research'],
  },
  {
    id: '11',
    name: 'Khon Kaen University',
    location: 'Khon Kaen',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 14,
    description:
      'Major university in Northeastern Thailand with diverse programs.',
    programs: ['Medicine', 'Engineering', 'Agriculture', 'Humanities'],
    tuitionFee: { min: 120000, max: 240000, currency: '฿' },
    acceptanceRate: 60,
    establishedYear: 1964,
    tags: ['Public', 'Research'],
  },
  {
    id: '12',
    name: 'Silpakorn University',
    location: 'Bangkok',
    country: 'Thailand',
    image: '/api/placeholder/400/300',
    ranking: 18,
    description:
      'Premier university for fine arts, archaeology, and cultural studies.',
    programs: ['Fine Arts', 'Architecture', 'Archaeology', 'Education'],
    tuitionFee: { min: 135000, max: 270000, currency: '฿' },
    acceptanceRate: 65,
    establishedYear: 1943,
    tags: ['Public', 'Research'],
  },
];

const UniversityTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [universities] = useState<University[]>(mockUniversities);
  const [showMobileFilterDropdown, setShowMobileFilterDropdown] =
    useState(false);
  const [filters, setFilters] = useState<UniversityFilters>({
    universityType: [],
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const totalUniversities = universities.length;

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.universityType.length > 0)
      count += filters.universityType.length;
    return count;
  }, [filters]);

  // Pagination calculations
  const totalPages = Math.ceil(universities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUniversities = universities.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (university: University) => {
    // Navigate to university detail page
    console.log('View details for:', university.name);
  };

  const handleApply = (university: University) => {
    // Handle application logic
    console.log('Apply to:', university.name);
  };

  return (
    <div className="md:bg-secondary min-h-screen sm:bg-white">
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
                    <img src={filterIcon} alt="Filter" className="h-4 w-4" />
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
                          {['Public', 'Private'].map((type) => (
                            <label
                              key={type}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={filters.universityType.includes(
                                  type.toLowerCase()
                                )}
                                onChange={(e) => {
                                  const newTypes = e.target.checked
                                    ? [
                                        ...filters.universityType,
                                        type.toLowerCase(),
                                      ]
                                    : filters.universityType.filter(
                                        (t) => t !== type.toLowerCase()
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
                          ))}
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
              <input
                type="search"
                placeholder="Search University"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Mobile Content Section */}
        <div className="px-4 pt-4 pb-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {currentUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
              />
            ))}
          </div>

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
                <input
                  type="search"
                  placeholder="Search University"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Desktop University Cards - 2 columns with scroll */}
            <div className="scrollbar-hide relative h-[450px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 pb-20">
                {currentUniversities.map((university) => (
                  <UniversityCard
                    key={university.id}
                    university={university}
                    onViewDetails={handleViewDetails}
                    onApply={handleApply}
                  />
                ))}
              </div>
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
    </div>
  );
};

export default UniversityTab;
