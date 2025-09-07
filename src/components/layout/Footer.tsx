import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Facebook from '../../assets/facebook.svg?react';
import YouTube from '../../assets/youtube.svg?react';
import Messenger from '../../assets/messenger.svg?react';
import Telegram from '../../assets/telegram.svg?react';
import CaretDown from '../../assets/caret-down.svg?react';
import SkyRiseLogo2 from '../../assets/skyrise-logo-2.svg?react';
import SuccessModal from '../common/SuccessModal';
import ApplicationForm from '../common/ApplicationForm';
// import ApplyConsultantForm from '../common/ApplyConsultantForm';

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: <Facebook className="fill-primary text-primary h-5 w-5" />,
  },

  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: <YouTube className="fill-primary h-5 w-5" />,
  },
  {
    name: 'Messenger',
    url: 'https://messenger.com',
    icon: <Messenger className="fill-primary h-5 w-5" />,
  },

  {
    name: 'Telegram',
    url: 'https://telegram.org',
    icon: <Telegram className="fill-primary h-5 w-5" />,
  },
];

const footerNavigation = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'About Us', path: '/about' },
  { name: 'Universities & Consultants', path: '/universities' },
  {
    name: 'Services',
    hasSubmenu: true,
    subItems: [
      {
        name: 'Consultation',
        path: '/services/consultation',
      },
      {
        name: 'Admission Process Support',
        path: '/services/admission-process-support',
      },
      { name: 'Visa', path: '/services/visa' },
      {
        name: 'Accommodation & Airport Pick-up',
        path: '/services/accommodation',
      },
      {
        name: 'Pre-University Program',
        path: '/services/pre-university',
      },
    ],
  },
  { name: 'Blogs', path: '/blogs' },
];

const Footer: React.FC = () => {
  const [expandedServices, setExpandedServices] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleFormSuccess = () => {
    setIsOpen(false);
    setShowSuccessModal(true);
  };

  const toggleServices = () => {
    setExpandedServices(!expandedServices);
  };
  return (
    <footer className="bg-secondary relative overflow-hidden px-6 pt-8 pb-15 lg:px-12 lg:pt-12 lg:pb-50">
      <div className="lg:flex lg:items-start lg:justify-between lg:space-x-8">
        <div className="mb-8 lg:mb-0 lg:max-w-md lg:flex-1">
          <h3 className="text-h1 lg:text-h3 text-primary mb-4 font-semibold">
            Contact Us
          </h3>
          <p className="text-body-3 lg:text-body-4 font-regular mb-6 lg:font-normal">
            Have questions about university? Reach out to SkyRise Corner – we're
            here to help you every step of the way!
          </p>

          <div className="mb-8 flex flex-col space-y-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:text-primary flex items-center space-x-3 transition-colors"
              >
                <div className="text-primary flex h-6 w-6 items-center justify-center">
                  {social.icon}
                </div>
                <span className="text-body-3 lg:text-body-4 font-regular lg:font-normal">
                  skyrise/{social.name.toLowerCase()}.com
                </span>
              </a>
            ))}
          </div>

          <div className="text-body-3 text-text-primary lg:text-body-4 mb-4 font-normal">
            Passionate about education? Join SkyRise Corner as a consultant and
            help students achieve their university dreams!
          </div>
          <button
            className="bg-primary text-h3 hover:bg-primary/80 lg:text-h4 w-full cursor-pointer rounded-lg px-6 py-2 font-medium text-white transition-colors lg:font-bold"
            onClick={() => setIsOpen(true)}
          >
            Apply with SkyRise
          </button>
        </div>

        <nav className="relative z-10 mb-8 lg:mt-10 lg:mr-20 lg:mb-0 lg:max-w-xs lg:flex-1">
          <ul className="space-y-3 lg:space-y-4">
            {footerNavigation.map((item) => (
              <li key={item.name}>
                {item.hasSubmenu ? (
                  <div ref={servicesRef}>
                    <button
                      onClick={toggleServices}
                      className="text-h3 text-text-primary hover:text-primary lg:text-h3 flex w-full cursor-pointer items-start text-left font-normal transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <span>{item.name}</span>
                        <CaretDown
                          className={`h-4 w-4 transition-transform duration-200 ${expandedServices ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </button>

                    {expandedServices && (
                      <ul className="mt-2 ml-4 space-y-2">
                        {item.subItems?.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              className="text-h4 lg:text-h4 text-text-primary hover:text-primary block cursor-pointer font-normal transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  item.path && (
                    <Link
                      to={item.path}
                      className="text-h3 lg:text-h3 text-text-primary hover:text-primary cursor-pointer font-normal transition-colors"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="absolute -right-20 -bottom-5 opacity-30 lg:right-12 lg:bottom-10">
        <div className="flex transform items-center justify-center">
          <div className="transform">
            <SkyRiseLogo2 className="text-text-secondary h-80 w-auto" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-60 flex items-start justify-center bg-black/40 pt-25"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <ApplicationForm
              onClose={() => setIsOpen(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Applied Successfully!"
        message="Thank you for applying with us. We will contact you shortly via email to confirm your application details."
      />
    </footer>
  );
};

export default Footer;
