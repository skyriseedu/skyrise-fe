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

const AboutPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      position: 'Founder & Director',
      department: 'International Business',
      university: 'Rangsit University',
      profileLink: 'https://linkedin.com/in/kaythwesan',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
      name: 'Sarah Johnson',
      position: 'Chief Technology Officer',
      department: 'Computer Science',
      university: 'MIT',
      profileLink: 'https://linkedin.com/in/sarahjohnson',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
      name: 'Michael Chen',
      position: 'Head of Operations',
      department: 'Business Administration',
      university: 'Stanford University',
      profileLink: 'https://linkedin.com/in/michaelchen',
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop',
      name: 'Emily Wang',
      position: 'Lead Designer',
      department: 'Digital Arts',
      university: 'RISD',
      profileLink: 'https://linkedin.com/in/emilywang',
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop',
      name: 'David Kim',
      position: 'Marketing Director',
      department: 'Marketing',
      university: 'NYU Stern',
      profileLink: 'https://linkedin.com/in/davidkim',
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
      name: 'Lisa Zhang',
      position: 'Data Scientist',
      department: 'Computer Science',
      university: 'Carnegie Mellon',
      profileLink: 'https://linkedin.com/in/lisazhang',
    },
    {
      id: 7,
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
      name: 'James Wilson',
      position: 'Product Manager',
      department: 'Business',
      university: 'Harvard Business School',
      profileLink: 'https://linkedin.com/in/jameswilson',
    },
  ];

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

      {/* Gallery Mobile View */}
      <div className="block lg:hidden">
        <TeamGallery members={teamMembers} />
      </div>

      {/* Gallery Desktop View */}
      <div className="hidden lg:block">
        <TeamGalleryDesktop members={teamMembers} />
      </div>

      <JoinUsCard />
      <AmbassadorSection />
      <ReviewsSection title="Student Success Stories" />
    </div>
  );
};

export default AboutPage;
