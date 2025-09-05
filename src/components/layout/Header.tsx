import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/useLanguage';
import { Link, useLocation } from 'react-router-dom';
import SkyRiseLogo from '../../assets/skyrise-logo.svg';
import Menu from '../../assets/menu.svg?react';
import Close from '../../assets/chat-close.svg?react';
import CaretDown from '../../assets/caret-down.svg?react';
import CaretDownWhite from '../../assets/caret-down-white.svg?react';

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
  const { language: currentLanguage, setLanguage } = useLanguage();
  const { i18n } = useTranslation();
  const [expandedServices, setExpandedServices] = useState(false);
  const location = useLocation();
  const servicesRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setExpandedServices(false);
      }
    };

    if (expandedServices) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedServices]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLanguageChange = (language: 'En' | 'Mm') => {
    setLanguage(language);
    i18n.changeLanguage(language === 'En' ? 'en' : 'my');
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

  const isActiveSubItem = (path: string | undefined) => {
    if (!path) return false;
    return location.pathname.startsWith(path);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header
      className={`sticky top-0 z-60 bg-white ${isHomePage ? 'shadow-sm' : ''}`}
    >
      <div className="flex items-center justify-between px-6 py-5 lg:px-15">
        <Link to="/" className="flex items-center">
          <img src={SkyRiseLogo} alt="SkyRise Logo" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center space-x-4 lg:flex">
          {navigationItems.map((item) => (
            <div key={item.name} className="relative">
              {item.hasSubmenu ? (
                <div
                  ref={servicesRef}
                  className="relative"
                  onClick={() => setExpandedServices(!expandedServices)}
                >
                  <button
                    className={`text-h3 flex cursor-pointer items-center space-x-1 rounded-full px-4 py-2 font-semibold transition-colors ${
                      isActiveMenuItem(item)
                        ? 'bg-primary text-white'
                        : 'text-text-primary hover:text-primary'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActiveMenuItem(item) ? (
                      <CaretDownWhite
                        className={`ml-1 h-3 w-3 transition-transform duration-200 ${
                          expandedServices ? 'rotate-180' : ''
                        }`}
                      />
                    ) : (
                      <CaretDown
                        className={`h-5 w-5 transition-transform duration-200 ${
                          expandedServices ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {expandedServices && (
                    <div className="animate-in fade-in-0 zoom-in-95 absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-100 bg-white py-2 shadow-lg duration-200">
                      {item.subItems?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`text-h3 block px-4 py-2 font-medium transition-colors rounded-md ${
                            isActiveSubItem(subItem.path)
                              ? 'bg-primary text-white'
                              : 'text-text-primary hover:bg-secondary hover:text-primary'
                          }`}
                          onClick={() => setExpandedServices(false)}
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
                  className={`text-h3 rounded-full px-4 py-2 font-semibold transition-colors ${
                    isActiveMenuItem(item)
                      ? 'bg-primary text-white'
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
          <div className="text-text-primary text-h3 lg:text-h3 flex items-center font-semibold">
            <button
              onClick={() => handleLanguageChange('En')}
              className={`cursor-pointer transition-all ${
                currentLanguage === 'En' ? 'underline' : 'hover:opacity-70'
              }`}
            >
              En
            </button>
            <span className="mx-1">/</span>
            <button
              onClick={() => handleLanguageChange('Mm')}
              className={`cursor-pointer transition-all ${
                currentLanguage === 'Mm' ? 'underline' : 'hover:opacity-70'
              }`}
            >
              Mm
            </button>
          </div>

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
