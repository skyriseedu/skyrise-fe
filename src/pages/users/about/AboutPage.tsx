import React from 'react';
import TeamGallery from '@/components/about-us/TeamGallery';
import TeamGalleryDesktop from '@/components/about-us/TeamGalleryDesktop';
import MissionVision from '@/components/about-us/MissionVision';
import GetToKnowSection from '@/components/about-us/GetToKnowSection';
import type { TeamMember } from '@/types/users/about-us';
import founderImage from '@/assets/images/founder.jpeg';
import rangsitImage from '@/assets/images/Vision.jpeg';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import StickyHeader from '@/components/common/StickyHeader';
import JoinUsCard from '@/components/about-us/JoinUsCard';
import AmbassadorSection from '@/components/about-us/AmbassadorSection';
import { usePrograms, useTeamMembers } from '@/queries';

import type { TeamMemberApiItem } from '@/types/users/team';

const AboutPage: React.FC = () => {
  const {
    data: teamMembersResponse,
    isPending: isTeamMembersLoading,
    isError: isTeamMembersError,
  } = useTeamMembers(1, 20);

  const { data: programsData } = usePrograms(); // get all, no pagination

  const apiTeamMembers = React.useMemo(
    () => teamMembersResponse?.data?.teamMembers ?? [],
    [teamMembersResponse]
  );

  const studentReviews = React.useMemo(() => {
    return (
      programsData?.data?.programs.flatMap(
        (program) => program.studentReviews || []
      ) || []
    );
  }, [programsData]);

  const mappedTeamMembers: TeamMember[] = React.useMemo(() => {
    if (!apiTeamMembers.length) {
      return [];
    }

    const pinnedMembers = apiTeamMembers.filter((member) => member.pinned);
    const membersToDisplay = pinnedMembers.length
      ? pinnedMembers
      : apiTeamMembers;

    return [...membersToDisplay]
      .sort((memberA, memberB) => memberA.order - memberB.order)
      .map((member: TeamMemberApiItem) => {
        const facebookLink =
          member.socialMediaLinks?.facebook?.trim() ||
          member.socialMediaLinks?.linkedin?.trim() ||
          member.socialMediaLinks?.twitter?.trim() ||
          member.socialMediaLinks?.youtube?.trim();

        return {
          id: member.id ?? member._id,
          image: member.profilePicture,
          name: member.memberName,
          position: member.role,
          department: member.major,
          university: member.university,
          profileLink: facebookLink || undefined,
        } satisfies TeamMember;
      });
  }, [apiTeamMembers]);

  const hasTeamMembers = mappedTeamMembers.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader
        title="About Us"
        showBackButton={false}
        mobilePadding="px-6"
        desktopPadding="lg:px-15"
        useContainer={false}
      />
      <GetToKnowSection />
      <MissionVision
        founderImage={founderImage}
        universityImage={rangsitImage}
      />

      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        {isTeamMembersLoading && (
          <p className="text-center text-sm text-neutral-500">
            Loading our team members...
          </p>
        )}

        {isTeamMembersError && !isTeamMembersLoading && (
          <p className="text-center text-sm text-red-500">
            We could not load the team members right now. Please try again
            later.
          </p>
        )}

        {!isTeamMembersLoading && !isTeamMembersError && !hasTeamMembers && (
          <p className="text-center text-sm text-neutral-500">
            Team member information will be available soon.
          </p>
        )}
      </section>

      {hasTeamMembers && (
        <>
          {/* Gallery Mobile View */}
          <div className="block lg:hidden">
            <TeamGallery members={mappedTeamMembers} />
          </div>

          {/* Gallery Desktop View */}
          <div className="hidden lg:block">
            <TeamGalleryDesktop members={mappedTeamMembers} />
          </div>
        </>
      )}

      <JoinUsCard />
      <AmbassadorSection />
      <ReviewsSection
        reviews={studentReviews}
        title="Student Success Stories"
        containerClassName="mx-auto max-w-7xl px-6 lg:px-8"
      />
    </div>
  );
};

export default AboutPage;
