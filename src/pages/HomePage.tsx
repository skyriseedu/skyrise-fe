import { AdmissionProcess } from '@/components/home/AdmissionProcess';
import OurServices from '@/components/home/OurServices';
import React from 'react';

const HomePage: React.FC = () => {
  return <div className="min-h-screen">
    <AdmissionProcess />
    <OurServices />
  </div>;
};

export default HomePage;
