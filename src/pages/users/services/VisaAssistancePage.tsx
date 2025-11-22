import React from 'react';
import ServicesShowcase from '@/components/services/consultation/ServicesShowcase';
import StickyHeader from '@/components/common/StickyHeader';
import visaImage from '@/assets/images/services-visa-page-cover.jpeg';

const VisaAssistancePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <StickyHeader
        title="Visa Assistance"
        subtitle=""
        mobilePadding="px-8 "
        desktopPadding="lg:px-15"
        showBackButton={false}
        useContainer={false}
      />

      {/* Hero Section */}
      <div className="relative w-full">
        <img
          src={visaImage}
          alt="Visa assistance cover"
          className="sm-[70px] h-55 w-full object-cover lg:h-[450px]"
        />
        <div
          className="absolute inset-x-0 bottom-4 py-2 md:py-2 lg:bottom-8 lg:py-2"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="container mx-auto px-6 text-left lg:px-8">
            <h1 className="text-h3 md:text-h2 lg:text-h2 font-semibold text-white">
              "Your dream. Our guidance. Let's build your future together!"
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="w-full px-6 py-8 lg:px-15">
        {/* What's Included Section */}
        <div className="mb-8">
          <h2 className="text-h4 lg:text-h2 text-text-primary mb-6 font-semibold">
            What's Included :
          </h2>

          <ul className="mb-8 space-y-4">
            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <span className="text-text-primary text-body-2 lg:text-body-3">
                <span className="font-bold">Hotel Accommodation</span>{' '}
                - A comfortable and safe stay
              </span>
            </li>

            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <span className="text-text-primary text-body-2 lg:text-body-3">
                <span className="font-bold">Visa Fees</span> - Government immigration visa fee
              </span>
            </li>

            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <span className="text-text-primary text-body-2 lg:text-body-3">
                <span className="font-bold">Guide Team Assistance</span> - Team member to assist throughout the visa process
              </span>
            </li>

            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <span className="text-text-primary text-body-2 lg:text-body-3">
                <span className="font-bold">Flight Tickets</span> - Optional
              </span>
            </li>
          </ul>
        </div>

        {/* Important Notes Section */}
        <div className="mb-8">
          <h3 className="text-h4 lg:text-h2 text-text-important mb-4 font-bold">
            Important Note :
          </h3>

          <ul className="mb-6 space-y-3">
            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <span className="text-text-primary text-body-2 lg:text-body-3">
                Our team provides comprehensive visa services both in Yangon and in third countries such as Laos (Vientiane); for further details and assistance, you can consult our team to receive the latest updates based on your study destination.
                <span className="font-bold"></span>
              </span>
            </li>

            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <span className="text-text-primary text-body-2 lg:text-body-3">
                <span className="font-bold">
                  Flight ticket is NOT included in our service{' '}
                </span>
                package and must be booked and paid by the student separately.
              </span>
            </li>
          </ul>

          <p className="text-text-primary text-body-2 lg:text-body-3 mb-4">
            We are committed to making your visa run smooth, stress-free, fully
            guided. Let our team handle it and no more extra work.
          </p>

          {/* Contact Button */}
          <div className="mb-8">
            <button
              onClick={() => {
                window.open(
                  'https://www.facebook.com/sharingaboutthai',
                  '_blank'
                );
              }}
              className="text-h4 rounded-lg bg-[#DE595B] px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-red-700"
            >
              Contact us today to reserve your spot
            </button>
          </div>
        </div>
      </section>

      <ServicesShowcase />
    </div>
  );
};

export default VisaAssistancePage;
