import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CaretDown from '../../assets/caret-down.svg?react';
import CaretDownWhite from '../../assets/caret-down-white.svg?react';
import SkyRiseLogo2 from '../../assets/skyrise-logo-2.svg?react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
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
  const location = useLocation();

  const toggleServices = () => {
    setExpandedServices(!expandedServices);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Navigation Panel */}
          <motion.div
            className="fixed top-22 right-0 z-50 h-[calc(100vh-5rem)] w-80 overflow-hidden rounded-l-xl bg-white shadow-xl"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              duration: 0.3,
            }}
          >
            <nav className="relative z-10 px-6 py-4">
              <ul className="py-1">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    {item.hasSubmenu ? (
                      <div>
                        <button
                          onClick={toggleServices}
                          className={`text-h3 block w-full rounded-lg px-4 py-3 text-left font-semibold transition-colors ${
                            isActiveMenuItem(item)
                              ? 'bg-primary text-white'
                              : 'text-text-primary hover:bg-secondary hover:text-primary'
                          }`}
                        >
                          <div className="flex items-center justify-start">
                            <span>{item.name}</span>
                            {isActiveMenuItem(item) ? (
                              <CaretDownWhite
                                className={`ml-3 h-3 w-3 transition-transform duration-200 ${
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
                          </div>
                        </button>

                        {expandedServices && (
                          <motion.ul
                            className="mt-1 ml-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.subItems?.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  to={subItem.path}
                                  onClick={onClose}
                                  className={`text-h3 block rounded-lg px-4 py-2 font-semibold transition-colors ${
                                    isActiveSubItem(subItem.path)
                                      ? 'bg-primary text-white'
                                      : 'text-text-primary hover:bg-secondary hover:text-primary'
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </div>
                    ) : (
                      item.path && (
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className={`text-h3 block rounded-lg px-4 py-3 font-semibold transition-colors ${
                            isActiveMenuItem(item)
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Navigation;
