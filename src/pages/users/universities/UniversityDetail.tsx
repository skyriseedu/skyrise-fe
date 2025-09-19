import React from 'react';
import { useParams } from 'react-router-dom';
import type { University } from '@/types/users/university';
import StickyHeader from '@/components/common/StickyHeader';
import KeyInfoCard from '@/components/universities/KeyInfoCard';
import ProgramStructure from '@/components/universities/ProgramStructure';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import Loading from '@/components/common/Loading';
import { useUniversityBySlug } from '@/queries';
import BookConsultationForm from '@/components/common/BookConsultationForm';
import SuccessModal from '@/components/common/SuccessModal';

const UniversityDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

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
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6 lg:py-8">
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
    {
      label: 'Intakes',
      value: university.intakes.length ? university.intakes.join(', ') : 'N/A',
    },

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
      <div className="mb-25 w-full px-4 py-4 lg:mb-0 lg:px-0 lg:py-0 lg:pl-1">
        <div className="mb-10 lg:mb-10">
          {/* Mobile Layout - Stacked Images */}
          <div className="relative flex flex-col items-center lg:hidden">
            <div className="relative w-full max-w-sm">
              {/* Top image -*/}
              <div className="relative z-10 h-30 w-40 overflow-hidden rounded-xl shadow-xl">
                <img
                  src={university.coverImages.image1}
                  alt={`${university.universityName} campus`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Bottom image -  */}
              <div className="absolute top-16 right-0 z-0 h-48 w-70 overflow-hidden rounded-xl shadow-xl">
                <img
                  src={university.coverImages.image2}
                  alt={`${university.universityName} campus`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout - Side by Side Images */}
          <div className="hidden lg:flex">
            <div className="relative h-100 flex-1 overflow-hidden">
              <img
                src={university.coverImages.image1}
                alt={`${university.universityName} campus`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative h-100 flex-1 overflow-hidden">
              <img
                src={university.coverImages.image2}
                alt={`${university.universityName} campus`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-15 lg:py-8 lg:pt-2">
        {/* About University Section */}
        <div className="mb-8 lg:mb-10">
          <h2 className="text-h3 lg:text-h2 text-text-primary mb-6 font-semibold lg:mb-8">
            About University
          </h2>
          <div className="max-w-4xl">
            <div
              className="text-text-primary text-body-2 lg:text-body-1 prose prose-lg mx-auto leading-relaxed"
              dangerouslySetInnerHTML={{ __html: university.aboutUniversity }}
            />
          </div>
        </div>

        {/* Key Information Section */}
        <div className="lg:py-6">
          <h2 className="text-h3 lg:text-h2 text-text-primary mb-8 font-semibold">
            Key Information
          </h2>
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              <div className="h-auto lg:h-24">
                <KeyInfoCard
                  label={keyInfo[0].label}
                  value={keyInfo[0].value}
                />
              </div>
              <div className="h-auto lg:h-24">
                <KeyInfoCard
                  label={keyInfo[1].label}
                  value={keyInfo[1].value}
                />
              </div>
              <div className="h-auto lg:h-24">
                <KeyInfoCard
                  label={keyInfo[2].label}
                  value={keyInfo[2].value}
                />
              </div>

              <div className="order-last col-span-2 h-18 lg:order-none lg:col-span-1 lg:row-span-2 lg:h-auto">
                <div
                  onClick={() => setIsOpen(true)}
                  className="bg-primary flex h-fit cursor-pointer flex-col items-center justify-center rounded-xl px-4 text-white transition-colors hover:bg-[#d43d4e] lg:h-full"
                >
                  <div className="text-center">
                    <div className="text-body-2 py-3 font-semibold lg:hidden">
                      Talk with your seniors
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-h3 font-semibold">Talk with</div>
                      <div className="text-h3 font-semibold">your seniors</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-auto lg:h-24">
                <KeyInfoCard
                  label={keyInfo[3].label}
                  value={keyInfo[3].value}
                />
              </div>
              <div className="h-auto lg:h-24">
                <KeyInfoCard
                  label={keyInfo[4].label}
                  value={keyInfo[4].value}
                />
              </div>
              <div className="h-auto lg:h-24">
                <KeyInfoCard
                  label={keyInfo[5].label}
                  value={keyInfo[5].value}
                />
              </div>
            </div>
          </div>
        </div>

        <ProgramStructure
          engFoundation={university.englishFoundation}
          bachelorRequirements={university.bachelor}
          masterRequirements={university.master}
          entryRequirements={university.entryRequirement}
          scholarRequirements={university.scholarshipRequirements}
        />

        <ReviewsSection
          title="Student Success Stories"
          reviews={university.studentReviews}
        />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-60 flex items-start justify-center bg-black/40 pt-25"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <BookConsultationForm
              onSuccess={() => setShowSuccessModal(true)}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Consultation Booked Successfully!"
        message="Thank you for booking a consultation with us. We will contact you shortly via email to confirm your appointment details."
      />
    </div>
  );
};

export default UniversityDetail;
