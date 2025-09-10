import React from 'react';
import TeamGallery from '@/components/about-us/TeamGallery';
import TeamGalleryDesktop from '@/components/about-us/TeamGalleryDesktop';
import MissionVision from '@/components/about-us/MissionVision';
import GetToKnowSection from '@/components/about-us/GetToKnowSection';
import founderImage from '@/assets/images/founder.jpeg';
import rangsitImage from '@/assets/images/Vision.jpeg';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import StickyHeader from '@/components/common/StickyHeader';
import JoinUsCard from '@/components/about-us/JoinUsCard';
import AmbassadorSection from '@/components/about-us/AmbassadorSection';
import { useConsultants } from '@/queries';
import type { TeamMember } from '@/types/users/about-us';

const AboutPage: React.FC = () => {
  const { data, isLoading, isError } = useConsultants();
  const teamMembers: TeamMember[] = data?.data?.consultants ?? [];
  return (
    <div className="min-h-screen bg-white">
      <StickyHeader title="About Us" showBackButton={false} />
      <GetToKnowSection />
      <MissionVision
        founderImage={founderImage}
        universityImage={rangsitImage}
      />

      {/* Consultants Gallery */}
      {!isLoading && !isError && teamMembers.length > 0 && (
        <>
          {/* Gallery Mobile View */}
          <div className="block lg:hidden">
            <TeamGallery members={teamMembers} />
          </div>

          {/* Gallery Desktop View */}
          <div className="hidden lg:block">
            <TeamGalleryDesktop members={teamMembers} />
          </div>
        </>
      )}

      <JoinUsCard />
      <AmbassadorSection />
      <ReviewsSection title="Student Success Stories" />
    </div>
  );
};

export default AboutPage;
