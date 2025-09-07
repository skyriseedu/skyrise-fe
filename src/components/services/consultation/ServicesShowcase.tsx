import React from 'react';
import ServiceCard from '@/components/services/consultation/ServiceCard';
import admissionSupportIcon from '@/assets/admission-support-home.svg';
import visaSupportIcon from '@/assets/visa-support-home.svg';
import preUniversityHome from '@/assets/pre-university-home.svg';
import airpotPickUp from '@/assets/airport-pickup-home.svg';

const ServicesShowcase: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-h3 lg:text-h2 font-semibold">Other services you may want to check</h1>

      <div className="flex gap-4 overflow-x-auto pb-2 mt-3 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
        <div className="shrink-0 md:shrink md:w-auto">
          <ServiceCard
            title="Admission Process Support"
            icon={admissionSupportIcon}
          />
        </div>
        <div className="shrink-0 md:shrink md:w-auto">
          <ServiceCard title="Visa Assistance" icon={visaSupportIcon} />
        </div>
        <div className="shrink-0 md:shrink md:w-auto">
          <ServiceCard title="Accommodation & Airport Pick-up" icon={airpotPickUp} />
        </div>
        <div className="shrink-0 md:shrink md:w-auto">
          <ServiceCard title="Pre-University Programs" icon={preUniversityHome} />
        </div>
      </div>
    </div>
  );
};

export default ServicesShowcase;
