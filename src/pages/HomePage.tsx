import { AdmissionProcess } from '@/components/home/AdmissionProcess';
import OurServices from '@/components/home/OurServices';
import HeroSection from '@/components/home/HeroSection';
import React from 'react';
import WhyChooseUs from '@/components/home/WhyChooseUs';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhyChooseUs />
      <AdmissionProcess />
      <OurServices />
    </div>
  );
};

export default HomePage;
