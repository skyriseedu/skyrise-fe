import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Facebook from '../../assets/facebook.svg?react';
import YouTube from '../../assets/youtube.svg?react';
import Messenger from '../../assets/messenger.svg?react';
import Telegram from '../../assets/telegram.svg?react';
import CaretDown from '../../assets/caret-down.svg?react';
import SkyRiseLogo2 from '../../assets/skyrise-logo-2.svg?react';

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
        path: '/services/accommodation-and-airport-pick-up',
      },
      {
        name: 'Pre-University Program',
        path: '/services/pre-university-program',
      },
    ],
  },
  { name: 'Blogs', path: '/blogs' },
];

const Footer: React.FC = () => {
  const [expandedServices, setExpandedServices] = useState(false);

  const toggleServices = () => {
    setExpandedServices(!expandedServices);
  };
  return (
    <footer className="bg-secondary relative overflow-hidden px-6 pt-8 pb-15 lg:px-12 lg:pt-12 lg:pb-20">
      <div className="lg:flex lg:items-start lg:justify-between lg:space-x-8">
        <div className="mb-8 lg:mb-0 lg:max-w-md lg:flex-1">
          <h3 className="text-h1 text-primary font-fustat mb-4 font-semibold">
            Contact Us
          </h3>
          <p className="text-body-4 text-text-primary mb-6">
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
                <span className="text-body-4">
                  skyrise/{social.name.toLowerCase()}.com
                </span>
              </a>
            ))}
          </div>

          <div className="text-body-4 text-text-primary mb-4">
            Passionate about education? Join SkyRise Corner as a consultant and
            help students achieve their university dreams!
          </div>
          <button className="bg-primary text-body-2 hover:bg-primary/80 w-full rounded-lg px-6 py-2 text-white transition-colors lg:w-auto">
            Join With Us!
          </button>
        </div>

        <nav className="mb-8 lg:mb-0 lg:max-w-xs lg:flex-1">
          <ul className="space-y-3 lg:space-y-4">
            {footerNavigation.map((item) => (
              <li key={item.name}>
                {item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={toggleServices}
                      className="md:text-body-2 lg:text-body-1 text-text-primary hover:text-primary flex w-full items-start text-left transition-colors"
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
                              className="md:text-body-2 lg:text-body-1 text-text-primary hover:text-primary block transition-colors"
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
                      className="md:text-body-2 lg:text-body-1 text-text-primary hover:text-primary transition-colors"
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

      <div className="absolute right-8 bottom-20 opacity-30 lg:right-12 lg:bottom-24 lg:opacity-50">
        <div className="flex h-32 w-32 rotate-45 transform items-center justify-center lg:h-40 lg:w-40">
          <div className="-rotate-45 transform">
            <SkyRiseLogo2 className="text-text-secondary h-50 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
