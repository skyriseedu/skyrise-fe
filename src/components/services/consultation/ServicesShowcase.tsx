import React from 'react';
import { useLocation } from 'react-router-dom';
import ServiceCard from '@/components/services/consultation/ServiceCard';
import admissionSupportIcon from '@/assets/admission-support-home.svg';
import visaSupportIcon from '@/assets/visa-support-home.svg';
import preUniversityHome from '@/assets/pre-university-home.svg';
import airpotPickUp from '@/assets/airport-pickup-home.svg';
import consultation from '@/assets/service-home.svg';

const ServicesShowcase: React.FC = () => {
  const location = useLocation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-h3 lg:text-h2 mb-6 font-semibold">
        Other services you may want to check
      </h1>

      <div className="mt-3 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
        {location.pathname !== '/services/admission-process-support' && (
          <div className="shrink-0 md:w-auto md:shrink">
            <ServiceCard
              title="Admission Process Support"
              icon={admissionSupportIcon}
              to="/services/admission-process-support"
            />
          </div>
        )}
        {location.pathname !== '/services/visa-assistance' && (
          <div className="shrink-0 md:w-auto md:shrink">
            <ServiceCard
              title="Visa Assistance"
              icon={visaSupportIcon}
              to="/services/visa-assistance"
            />
          </div>
        )}
        {location.pathname !==
          '/services/accommodation-and-airport-pick-up' && (
          <div className="shrink-0 md:w-auto md:shrink">
            <ServiceCard
              title="Accommodation & Airport Pick-up"
              icon={airpotPickUp}
              to="/services/accommodation-and-airport-pick-up"
            />
          </div>
        )}
        {location.pathname !== '/services/pre-university' && (
          <div className="shrink-0 md:w-auto md:shrink">
            <ServiceCard
              title="Pre-University Programs"
              icon={preUniversityHome}
              to="/services/pre-university"
            />
          </div>
        )}
        {location.pathname !== '/services/consultation' && (
          <div className="shrink-0 md:w-auto md:shrink">
            <ServiceCard
              title="Consultation"
              icon={consultation}
              to="/services/consultation"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesShowcase;
