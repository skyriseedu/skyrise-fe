import React from 'react';
import ServicesShowcase from '@/components/services/consultation/ServicesShowcase';
import StickyHeader from '@/components/common/StickyHeader';
import preUniversityCover from '../../../assets/images/Pre-university Programs.png';

const PreUniversityPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <StickyHeader
        title="Pre-University"
        subtitle=""
        mobilePadding="px-8"
        desktopPadding=" lg:px-15"
        showBackButton={false}
        useContainer={false}
      />

      {/* Hero Section */}
      <div className="relative w-full">
        <img
          src={preUniversityCover}
          alt="Pre-University cover"
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
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-text-primary text-body-2 lg:text-body-3 mb-6">
            At <span className="font-bold">SKYRISE</span>, we do not just help
            you get into university - we prepare you for success before you even
            start.
          </p>
        </div>

        {/* We Help You Connect With Section */}
        <div className="mb-8">
          <h2 className="text-h4 lg:text-h2 text-text-primary mb-6 font-semibold">
            We help you to connect with :
          </h2>

          <ul className="mb-8 space-y-4">
            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <div className="text-text-primary text-body-2 lg:text-body-3">
                <span className="font-bold">
                  Academic foundation Onsite Programs
                </span>{' '}
                 such as{' '}
                <span className="font-bold">GED, IGCSE, OSSD</span> and other
                internationally recognized qualifications to help you meet
                university entry requirements.
              </div>
            </li>

            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <div className="text-text-primary text-body-2 lg:text-body-3">
                <span className="font-bold">Language programs</span> that also
                provide ED visa support - ideal for students who want to go abroad with less financial burden and who are already in aboard, seeking to continue their studies legally and productively.
              </div>
            </li>

            <li className="flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <div className="text-text-primary text-body-2 lg:text-body-3">
                <span className="font-bold">Language Available :</span> Thai,
                English, Japanese, Chinese & more
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              window.open(
                'https://www.facebook.com/sharingaboutthai',
                '_blank'
              );
            }}
            className="text-h4 w-full rounded-lg bg-[#DE595B] px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-red-700"
          >
            Contact us today to get more detail!
          </button>
        </div>
      </section>

      <ServicesShowcase />
    </div>
  );
};

export default PreUniversityPage;
