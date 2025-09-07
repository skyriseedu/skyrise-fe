import React from 'react';
import { useParams } from 'react-router-dom';
import type { University } from '@/types/users/university';
import StickyHeader from '@/components/common/StickyHeader';
import KeyInfoCard from '@/components/program-details/KeyInfoCard';
import ReviewCard from '@/components/reviews/ReviewCard';
import calendarIcon from '@/assets/calendar.svg';
import graduationCap from '@/assets/graduation-cap.svg';
import document from '@/assets/document.svg';
import location from '@/assets/location.svg';
import bookOpen from '@/assets/book-open.svg';

// Mock data - this would normally come from an API
const mockUniversity: University = {
  _id: '1',
  id: '1',
  universityName: 'Rangsit University',
  universityType: 'Private',
  logoImage: '/api/placeholder/100/100',
  coverImages: {
    image1: '/api/placeholder/400/400',
    image2: '/api/placeholder/300/300',
  },
  aboutUniversity:
    'Rangsit University is a leading private university in Thailand, known for its excellence in education, research, and innovation. The university offers a wide range of undergraduate and graduate programs across various disciplines.',
  englishFoundation:
    '<p>Our English Foundation program is designed to prepare students for academic success in their chosen field of study.</p>',
  bachelor:
    '<p>Bachelor degree programs spanning across multiple disciplines including Business, Engineering, Medicine, and Arts.</p>',
  master:
    '<p>Advanced master programs for specialized career development and research opportunities.</p>',
  keyInformation: {
    ranking: '#2025',
    foundedYear: 1990,
    location: 'Bangkok, Thailand',
    creditTransfer: 'Available',
    programs: 50,
  },
  studentReviews: [
    {
      _id: '1',
      studentName: 'John Doe',
      major: 'Business Administration',
      studentImage: '/api/placeholder/80/80',
      review:
        'Great university with excellent facilities and supportive faculty.',
    },
    {
      _id: '2',
      studentName: 'Jane Smith',
      major: 'Computer Science',
      studentImage: '/api/placeholder/80/80',
      review: 'The programs are comprehensive and industry-relevant.',
    },
  ],
  status: 'published',
  views: 1250,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  slug: 'rangsit-university',
};

const UniversityDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // In a real app, you'd use: const { data: universityData, isLoading, error } = useUniversityBySlug(slug || '');
  // For now, we'll use the mock data
  console.log('University slug:', slug); // This would be used for fetching real data
  const university = mockUniversity;
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-gray-600">Loading university details...</p>
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            University Not Found
          </h2>
          <p className="text-gray-600">
            The university you're looking for doesn't exist or failed to load.
          </p>
        </div>
      </div>
    );
  }

  const keyInfo = [
    {
      icon: graduationCap,
      label: 'University Ranking',
      value: university.keyInformation.ranking,
    },
    {
      icon: calendarIcon,
      label: 'Founded Year',
      value: university.keyInformation.foundedYear.toString(),
    },
    {
      icon: location,
      label: 'Location',
      value: university.keyInformation.location,
    },
    {
      icon: document,
      label: 'Credit Transfer',
      value: university.keyInformation.creditTransfer,
    },
    {
      icon: bookOpen,
      label: 'Programs',
      value: university.keyInformation.programs.toString(),
    },
  ];

  const renderSection = (title: string, content: string) => {
    if (!content || content.trim() === '') return null;

    return (
      <div className="mb-8">
        <h3 className="text-h3 lg:text-h2 text-text-primary mb-6 font-semibold">
          {title}
        </h3>
        <div
          className="text-text-primary prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader
        title={university.universityName}
        subtitle=""
        mobilePadding="px-8"
        desktopPadding="lg:px-0"
      />

      {/* Hero Section with Cover Images */}
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        <div className="mb-12 flex flex-col items-center gap-8 lg:mb-20 lg:flex-row lg:gap-12">
          <div className="relative w-full flex-shrink-0 lg:w-auto">
            <div className="relative mx-auto h-[240px] w-[240px] lg:mx-0 lg:h-[380px] lg:w-[380px]">
              {/* Main university image */}
              <div className="absolute right-0 bottom-0 h-44 w-44 overflow-hidden rounded-full shadow-xl lg:h-72 lg:w-72">
                <img
                  src={university.coverImages.image1}
                  alt={`${university.universityName} campus`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Secondary university image */}
              <div
                className="absolute top-0 left-0 z-10 h-28 w-28 overflow-hidden rounded-full shadow-xl lg:h-48 lg:w-48"
                style={{
                  top: '15%',
                  left: '-5%',
                }}
              >
                <img
                  src={university.coverImages.image2}
                  alt={`${university.universityName} campus`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* University logo overlay */}
              <div className="absolute bottom-2 left-2 z-20 h-16 w-16 overflow-hidden rounded-full bg-white p-2 shadow-lg lg:h-20 lg:w-20">
                <img
                  src={university.logoImage}
                  alt={`${university.universityName} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="max-w-2xl flex-1 px-4 lg:px-0">
            <h2 className="text-h3 lg:text-h2 text-text-primary mb-4 font-semibold lg:mb-6">
              About University
            </h2>
            <div
              className="text-text-primary text-body-2 lg:text-body-2 prose max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: university.aboutUniversity }}
            />
          </div>
        </div>

        {/* Key Information Section */}
        <div className="py-12">
          <h2 className="text-h3 lg:text-h2 text-text-primary mb-8 font-semibold">
            Key Information
          </h2>
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-6">
              {keyInfo.map((info, index) => (
                <div key={index} className="h-20 lg:h-24">
                  <KeyInfoCard
                    icon={info.icon}
                    label={info.label}
                    value={info.value}
                  />
                </div>
              ))}

              <div className="order-last col-span-2 h-18 lg:order-none lg:col-span-1 lg:row-span-2 lg:h-auto">
                <div className="bg-primary flex h-full cursor-pointer flex-col items-center justify-center rounded-xl px-4 text-white transition-colors hover:bg-[#d43d4e]">
                  <div className="text-center">
                    <div className="text-body-2 font-semibold lg:hidden">
                      Talk with your seniors
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-h3 font-semibold">Talk with</div>
                      <div className="text-h3 font-semibold">your seniors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Structure Sections */}
        <div className="py-12">
          <h2 className="text-h3 lg:text-h2 text-text-primary mb-8 font-semibold">
            Program Structure
          </h2>

          {renderSection('English Foundation', university.englishFoundation)}
          {renderSection('Bachelor', university.bachelor)}
          {renderSection('Master', university.master)}
        </div>

        {/* Student Success Stories / Reviews */}
        {university.studentReviews && university.studentReviews.length > 0 && (
          <div className="py-12">
            <h2 className="text-h3 lg:text-h2 text-text-primary mb-8 font-semibold">
              Student Success Stories
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {university.studentReviews.map((review) => (
                <div key={review._id} className="w-full">
                  <ReviewCard
                    name={review.studentName}
                    program={review.major}
                    testimonial={review.review}
                    imageUrl={review.studentImage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leading Universities Section
        <div className="py-12">
          <LeadingUniversities
            title="Other Leading Universities"
            className="border-t border-gray-200 pt-12"
          />
        </div> */}
      </div>
    </div>
  );
};

export default UniversityDetail;
