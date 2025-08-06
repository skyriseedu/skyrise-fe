import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SkyRiseLogo from '../../assets/skyrise-logo.svg';
import Menu from '../../assets/menu.svg?react';
import Close from '../../assets/close.svg?react';
import CaretDown from '../../assets/caret-down.svg?react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'About Us', path: '/about' },
  { name: 'Universities & Consultants', path: '/universities' },
  {
    name: 'Services',
    hasSubmenu: true,
    subItems: [
      { name: 'Consultation', path: '/services/consultation' },
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

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const [currentLanguage, setCurrentLanguage] = useState('En');
  const [expandedServices, setExpandedServices] = useState(false);
  const location = useLocation();

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'En' ? 'Mm' : 'En');
  };

  const isActiveMenuItem = (item: (typeof navigationItems)[0]) => {
    if (item.hasSubmenu) {
      return location.pathname.startsWith('/services');
    }
    if (item.path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(item.path || '');
  };

  return (
    <header className="relative z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 pt-3 pb-6">
        <Link to="/" className="flex items-center">
          <img src={SkyRiseLogo} alt="SkyRise Logo" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center space-x-8 lg:flex">
          {navigationItems.map((item) => (
            <div key={item.name} className="relative">
              {item.hasSubmenu ? (
                <div
                  className="relative"
                  onMouseEnter={() => setExpandedServices(true)}
                  onMouseLeave={() =>
                    setTimeout(() => setExpandedServices(false), 200)
                  }
                >
                  <button
                    className={`text-body-4 ${isActiveMenuItem(item) ? '' : 'hover:text-primary'} flex items-center space-x-1 font-semibold transition-colors ${
                      isActiveMenuItem(item)
                        ? 'bg-primary rounded-full px-4 py-2 text-white'
                        : 'text-text-primary'
                    }`}
                  >
                    <span>{item.name}</span>
                    <CaretDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedServices ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedServices && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-100 bg-white py-2 font-semibold shadow-lg">
                      {item.subItems?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="text-body-5 text-text-primary hover:bg-secondary hover:text-primary block px-4 py-2 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path || '/'}
                  className={`text-body-4 font-medium transition-colors ${
                    isActiveMenuItem(item)
                      ? 'bg-primary rounded-full px-4 py-2 text-white'
                      : 'text-text-primary hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="text-text-primary text-body-2 flex items-center space-x-1"
          >
            <span>
              <span className={currentLanguage === 'En' ? 'underline' : ''}>
                En
              </span>
              /
              <span className={currentLanguage === 'Mm' ? 'underline' : ''}>
                Mm
              </span>
            </span>
          </button>

          <button
            onClick={onMenuToggle}
            className="hover:text-primary text-primary p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <Close className="text-primary h-6 w-6" />
            ) : (
              <Menu className="text-primary h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
