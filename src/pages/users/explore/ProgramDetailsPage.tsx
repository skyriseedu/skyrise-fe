import React, { useMemo } from 'react';
import KeyInfoCard from '@/components/program-details/KeyInfoCard';
import ProgramStructure from '@/components/program-details/ProgramStructure';
import StickyHeader from '@/components/common/StickyHeader';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import Loading from '@/components/common/Loading';
import calendarIcon from '@/assets/calendar.svg';
import graduationCap from '@/assets/graduation-cap.svg';
import documentIcon from '@/assets/document.svg';
import card from '@/assets/card.svg';
import location from '@/assets/location.svg';
import bookOpen from '@/assets/book-open.svg';
import { useParams } from 'react-router-dom';
import { useProgramBySlug } from '@/queries';
import BookConsultationForm from '@/components/common/BookConsultationForm';
import SuccessModal from '@/components/common/SuccessModal';
import '@/components/common/TextEditor/QuillContent.css';

const ProgramDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isConsultOpen, setIsConsultOpen] = React.useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] =
    React.useState<boolean>(false);
  const { data, isLoading, isError } = useProgramBySlug(slug || '');

  const keyInfoCards = useMemo(
    () => [
      {
        icon: graduationCap,
        label: 'Degree',
        value: data?.data?.keyInformation?.degree ?? '—',
      },
      {
        icon: calendarIcon,
        label: 'Duration',
        value: data?.data?.keyInformation?.duration ?? '—',
      },
      {
        icon: location,
        label: 'Location',
        value: data?.data?.keyInformation?.location ?? '—',
      },
      {
        icon: documentIcon,
        label: 'Application Fees',
        value: data?.data?.keyInformation?.applicationFee ?? '—',
      },
      {
        icon: bookOpen,
        label: 'Upcoming Intake',
        value: data?.data?.keyInformation?.upcomingIntake?.[0] ?? '—',
      },
      {
        icon: card,
        label: 'Total Tuition Fee',
        value: data?.data?.keyInformation?.totalTuitionFees ?? '—',
      },
    ],
    [data]
  );

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader
        title={isLoading ? undefined : data?.data?.programName}
        subtitle={isLoading ? undefined : data?.data?.universityName}
        mobilePadding="px-6"
        desktopPadding="lg:px-15"
        useContainer={false}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
          <div className="flex h-96 items-center justify-center">
            <Loading size="lg" color="primary" />
          </div>
        </div>
      ) : isError ? (
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
          <div className="flex h-96 items-center justify-center">
            <p className="text-body-3 text-red-600">
              Failed to load program details.
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
          <div className="mb-12 flex flex-col items-center gap-8 lg:mb-20 lg:flex-row lg:gap-12">
            <div className="relative w-full flex-shrink-0 lg:w-auto">
              <div className="relative mx-auto h-[240px] w-[240px] lg:mx-0 lg:h-[380px] lg:w-[380px]">
                <div className="absolute right-0 bottom-0 h-44 w-44 overflow-hidden rounded-full shadow-xl lg:h-72 lg:w-72">
                  <img
                    src={
                      data?.data?.images?.image1 ||
                      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&h=500&fit=crop'
                    }
                    alt={data?.data?.programName || 'Program'}
                    className="h-full w-full object-contain bg-white"
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
                    src={
                      data?.data?.images?.image2 ||
                      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop'
                    }
                    alt={data?.data?.universityName || 'Program image'}
                    className="h-full w-full object-contain bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="max-w-2xl flex-1 px-4 lg:px-0">
              <h2 className="text-h3 lg:text-h2 text-text-primary mb-4 font-semibold lg:mb-6">
                About Program
              </h2>
              <div
                className="quill-content text-text-primary text-body-2 lg:text-body-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    data?.data?.about ||
                    'Program description is not available.',
                }}
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
                    icon={keyInfoCards[0].icon}
                    label={keyInfoCards[0].label}
                    value={keyInfoCards[0].value}
                  />
                </div>
                <div className="h-20 lg:h-24">
                  <KeyInfoCard
                    icon={keyInfoCards[1].icon}
                    label={keyInfoCards[1].label}
                    value={keyInfoCards[1].value}
                  />
                </div>
                <div className="h-20 lg:h-24">
                  <KeyInfoCard
                    icon={keyInfoCards[2].icon}
                    label={keyInfoCards[2].label}
                    value={keyInfoCards[2].value}
                  />
                </div>

                <div className="order-last col-span-2 h-18 lg:order-none lg:col-span-1 lg:row-span-2 lg:h-auto">
                  <div
                    className="bg-primary flex h-full cursor-pointer flex-col items-center justify-center rounded-xl px-4 text-white transition-colors hover:bg-[#d43d4e]"
                    onClick={() => setIsConsultOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-body-2 font-semibold lg:hidden">
                        Book Free Consultation
                      </div>
                      <div className="hidden lg:block">
                        <div className="text-h3 font-semibold">Book</div>
                        <div className="text-h3 font-semibold">Free</div>
                        <div className="text-h3 font-semibold">
                          Consultation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-20 lg:h-24">
                  <KeyInfoCard
                    icon={keyInfoCards[3].icon}
                    label={keyInfoCards[3].label}
                    value={keyInfoCards[3].value}
                  />
                </div>
                <div className="h-20 lg:h-24">
                  <KeyInfoCard
                    icon={keyInfoCards[4].icon}
                    label={keyInfoCards[4].label}
                    value={keyInfoCards[4].value}
                  />
                </div>
                <div className="h-20 lg:h-24">
                  <KeyInfoCard
                    icon={keyInfoCards[5].icon}
                    label={keyInfoCards[5].label}
                    value={keyInfoCards[5].value}
                  />
                </div>
              </div>
            </div>
          </div>
          {(data?.data?.undergraduateEntryRequirement ||
            data?.data?.creditDetails ||
            data?.data?.careerPaths) && (
            <ProgramStructure
              undergraduateEntryRequirement={
                data?.data?.undergraduateEntryRequirement
              }
              creditDetails={data?.data?.creditDetails}
              careerPaths={data?.data?.careerPaths}
            />
          )}
        </div>
      )}
      {!isLoading && !isError && (
        <ReviewsSection
          reviews={data?.data?.studentReviews}
          containerClassName="mx-auto max-w-7xl px-4 lg:px-6"
        />
      )}
      {isConsultOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 pt-4"
          onClick={() => setIsConsultOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <BookConsultationForm
              onClose={() => setIsConsultOpen(false)}
              onSuccess={() => {
                setIsConsultOpen(false);
                setShowSuccessModal(true);
              }}
            />
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thank you for your submission"
        message="You have successfully submitted the form. Please check your email for further notices."
      />
    </div>
  );
};

export default ProgramDetailsPage;
