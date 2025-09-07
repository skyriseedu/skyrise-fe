import React from 'react';
import { useParams } from 'react-router-dom';
import { useUniversityBySlug } from '@/queries';
import StickyHeader from '@/components/common/StickyHeader';
import KeyInfoCard from '@/components/program-details/KeyInfoCard';
import ReviewCard from '@/components/reviews/ReviewCard';
import calendarIcon from '@/assets/calendar.svg';
import graduationCap from '@/assets/graduation-cap.svg';
import document from '@/assets/document.svg';
import location from '@/assets/location.svg';
import bookOpen from '@/assets/book-open.svg';

const UniversityDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: universityData,
    isLoading,
    error,
  } = useUniversityBySlug(slug || '');

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

  if (error || !universityData?.data?.university) {
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

  const university = universityData.data.university;

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
              <div className="absolute right-0 bottom-0 h-44 w-44 overflow-hidden rounded-full shadow-xl lg:h-72 lg:w-72">
                <img
                  src={university.coverImages.image1}
                  alt={`${university.universityName} campus`}
                  className="h-full w-full object-cover"
                />
              </div>

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

        {/* Entry Requirements and Scholarship Requirements */}
        <div className="py-12">
          <div className="space-y-8">
            <div>
              <button className="flex w-full items-center justify-between rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100">
                <span className="text-lg font-semibold text-gray-900">
                  Entry Requirements
                </span>
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div>
              <button className="flex w-full items-center justify-between rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100">
                <span className="text-lg font-semibold text-gray-900">
                  Scholarship Requirements
                </span>
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
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
      </div>
    </div>
  );
};

export default UniversityDetail;
