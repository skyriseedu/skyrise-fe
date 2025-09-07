import React from 'react';
import { useParams } from 'react-router-dom';
import type { University } from '@/types/users/university';
import StickyHeader from '@/components/common/StickyHeader';
import KeyInfoCard from '@/components/universities/KeyInfoCard';
import ProgramStructure from '@/components/program-details/ProgramStructure';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import Loading from '@/components/common/Loading';
import { useUniversityBySlug } from '@/queries';

const UniversityDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: universityData,
    isLoading,
    error,
  } = useUniversityBySlug(slug || '');
  const university = universityData?.data?.university as University | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <StickyHeader
          title={undefined}
          subtitle={undefined}
          mobilePadding="px-8"
          desktopPadding="lg:px-0"
          isLoading={isLoading}
        />
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
          <div className="flex h-96 items-center justify-center">
            <Loading size="lg" color="primary" />
          </div>
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
      label: 'University Ranking',
      value: university.keyInformation.ranking,
    },
    {
      label: 'Founded Year',
      value: university.keyInformation.foundedYear.toString(),
    },
    {
      label: 'Programs',
      value: university.keyInformation.programs.toString(),
    },
    // {

    //   label: 'Intakes',
    //   value: university.keyInformation.intakes.join(', '),
    // },

    {
      label: 'Credit Transfer',
      value: university.keyInformation.creditTransfer,
    },
    {
      label: 'Location',
      value: university.keyInformation.location,
    },
  ];

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
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  label={keyInfo[0].label}
                  value={keyInfo[0].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  label={keyInfo[1].label}
                  value={keyInfo[1].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  label={keyInfo[2].label}
                  value={keyInfo[2].value}
                />
              </div>

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

              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  label={keyInfo[3].label}
                  value={keyInfo[3].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  label={keyInfo[4].label}
                  value={keyInfo[4].value}
                />
              </div>
            </div>
          </div>
        </div>

        <ProgramStructure />
      </div>

      <ReviewsSection />
    </div>
  );
};

export default UniversityDetail;
