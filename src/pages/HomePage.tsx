import { AdmissionProcess } from '@/components/home/AdmissionProcess';
import OurServices from '@/components/home/OurServices';
import HeroSection from '@/components/home/HeroSection';
import React from 'react';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsSection from '@/components/home/StatsSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhyChooseUs />
      <AdmissionProcess />
      <OurServices />
      <StatsSection />
    </div>
  );
};

export default HomePage;
