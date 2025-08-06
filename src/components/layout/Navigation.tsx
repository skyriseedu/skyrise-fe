import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CaretDown from '../../assets/caret-down.svg?react';
import SkyRiseLogo2 from '../../assets/skyrise-logo-2.svg?react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: 'Home', path: '/', isActive: true },
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
        path: '',
      },
      { name: 'Visa', path: '/services/visa' },
      {
        name: 'Accommodation & Airport Pick-up',
        path: '/services/accommodation',
      },
      { name: 'Pre-University Program', path: '/services/pre-university' },
    ],
  },
  { name: 'Blogs', path: '/blogs' },
];

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const [expandedServices, setExpandedServices] = useState(false);

  if (!isOpen) return null;

  const toggleServices = () => {
    setExpandedServices(!expandedServices);
  };

  return (
    <div className="fixed top-21 right-0 z-50 h-full w-80 transform overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-300 ease-in-out">
      <div className="flex justify-end p-4"></div>

      <nav className="px-6 py-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.name}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={toggleServices}
                    className={`text-body-1 text-text-primary hover:bg-secondary hover:text-primary block w-full rounded-lg px-4 py-3 text-left font-semibold`}
                  >
                    <div className="flex items-center justify-start">
                      <span>{item.name}</span>
                      <CaretDown
                        className={`h-4 w-4 transition-transform duration-200 ${expandedServices ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {expandedServices && (
                    <ul className="mt-2 ml-4 space-y-1">
                      {item.subItems?.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path}
                            onClick={onClose}
                            className="text-body-1 text-text-primary hover:bg-primary hover:text-primary block rounded-lg px-4 py-2 font-semibold transition-colors"
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
                    onClick={onClose}
                    className={`text-body-1 block rounded-lg px-4 py-3 font-semibold transition-colors ${
                      item.isActive
                        ? 'bg-primary text-white'
                        : 'text-text-primary hover:bg-secondary hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-30 -left-20 opacity-20">
        <div className="flex transform items-center justify-center">
          <SkyRiseLogo2 className="text-text-secondary h-70 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
