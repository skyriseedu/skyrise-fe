import { AdmissionProcess } from '@/components/home/AdmissionProcess';
import OurServices from '@/components/home/OurServices';
import HeroSection from '@/components/home/HeroSection';
import React from 'react';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsSection from '@/components/home/StatsSection';
import Button from '@/components/common/Button';

const HomePage: React.FC = () => {
  return (
    <div className="mb-4 min-h-screen">
      <HeroSection />
      <WhyChooseUs />
      <AdmissionProcess />
      <OurServices />
      <StatsSection />

      <div className="flex justify-center px-4 py-8">
        <Button
          size="lg"
          className="text-body-5 lg:text-body-3 w-full rounded-[10px] font-semibold sm:w-auto sm:px-12"
          onClick={() => console.log('Book Free Consultation clicked')}
        >
          Book Free Consultation
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
