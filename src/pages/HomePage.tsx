import { AdmissionProcess } from '@/components/home/AdmissionProcess';
import OurServices from '@/components/home/OurServices';
import HeroSection from '@/components/home/HeroSection';
import React from 'react';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import StatsSection from '@/components/home/StatsSection';
import Button from '@/components/common/Button';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen mb-4">
      <HeroSection />
      <WhyChooseUs />
      <AdmissionProcess />
      <OurServices />
      <StatsSection />
      
      <div className="flex justify-center py-8 px-4">
        <Button
          size="lg"
          className="w-full sm:w-auto sm:px-12 text-body-5 lg:text-body-3 font-semibold rounded-[10px]"
          onClick={() => console.log('Book Free Consultation clicked')}
        >
          Book Free Consultation
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
