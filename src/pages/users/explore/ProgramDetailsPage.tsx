import React from 'react';
import KeyInfoCard from '@/components/program-details/KeyInfoCard';
import ProgramStructure from '@/components/program-details/ProgramStructure';
import StickyHeader from '@/components/common/StickyHeader';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import calendarIcon from '@/assets/calendar.svg';
import graduationCap from '@/assets/graduation-cap.svg';
import document from '@/assets/document.svg';
import card from '@/assets/card.svg';
import location from '@/assets/location.svg';
import bookOpen from '@/assets/book-open.svg';

const ProgramDetailsPage: React.FC = () => {
  const programData = {
    title: 'Bachelor of Science in Information and Communication Technology',
    description:
      "The Information and Communication Technology (ICT) program encourages students to think critically and creatively as they learn how to find, process, and apply the vast amounts of information available in today's connected, digital world.",
    keyInfo: [
      {
        icon: graduationCap,
        label: 'Degree',
        value: 'Bachelor',
      },
      {
        icon: calendarIcon,
        label: 'Duration',
        value: '4 years',
      },
      {
        icon: location,
        label: 'Location',
        value: 'Bangkok',
      },
      {
        icon: document,
        label: 'Application Fees',
        value: 'Charged',
      },
      {
        icon: bookOpen,
        label: 'Upcoming Intake',
        value: 'August 2025',
      },
      {
        icon: card,
        label: 'Total Tuition Fee',
        value: '600,000 THB',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader
        title={programData.title}
        subtitle="Rangsit University"
        mobilePadding="px-8"
        desktopPadding="lg:px-0"
      />

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        <div className="mb-12 flex flex-col items-center gap-8 lg:mb-20 lg:flex-row lg:gap-12">
          <div className="relative w-full flex-shrink-0 lg:w-auto">
            <div className="relative mx-auto h-[240px] w-[240px] lg:mx-0 lg:h-[380px] lg:w-[380px]">
              <div className="absolute right-0 bottom-0 h-44 w-44 overflow-hidden rounded-full shadow-xl lg:h-72 lg:w-72">
                <img
                  src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&h=500&fit=crop"
                  alt="Programming"
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
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop"
                  alt="Web Design"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="max-w-2xl flex-1 px-4 lg:px-0">
            <h2 className="text-h3 lg:text-h2 text-text-primary mb-4 font-bold lg:mb-6">
              About Program
            </h2>
            <p className="text-text-primary text-body-2 lg:text-body-2 leading-relaxed">
              {programData.description}
            </p>
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
                  icon={programData.keyInfo[0].icon}
                  label={programData.keyInfo[0].label}
                  value={programData.keyInfo[0].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[1].icon}
                  label={programData.keyInfo[1].label}
                  value={programData.keyInfo[1].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[2].icon}
                  label={programData.keyInfo[2].label}
                  value={programData.keyInfo[2].value}
                />
              </div>

              <div className="order-last col-span-2 h-18 lg:order-none lg:col-span-1 lg:row-span-2 lg:h-auto">
                <div className="bg-primary flex h-full cursor-pointer flex-col items-center justify-center rounded-xl px-4 text-white transition-colors hover:bg-[#d43d4e]">
                  <div className="text-center">
                    <div className="text-body-2 font-semibold lg:hidden">
                      Book Free Consultation
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-h3 font-semibold">Book</div>
                      <div className="text-h3 font-semibold">Free</div>
                      <div className="text-h3 font-semibold">Consultation</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[3].icon}
                  label={programData.keyInfo[3].label}
                  value={programData.keyInfo[3].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[4].icon}
                  label={programData.keyInfo[4].label}
                  value={programData.keyInfo[4].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[5].icon}
                  label={programData.keyInfo[5].label}
                  value={programData.keyInfo[5].value}
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

export default ProgramDetailsPage;
