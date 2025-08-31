import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import FloatingChatButton from './FloatingChatButton';
import { FilterProvider, useFilter } from '@/contexts/FilterContext';

const LayoutContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsMobileFilterOpen } = useFilter();

  const toggleMenu = () => {
    // Close filter when opening menu
    if (!isMenuOpen) {
      setIsMobileFilterOpen(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-bg flex min-h-screen flex-col">
      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />

      <Navigation isOpen={isMenuOpen} onClose={closeMenu} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <FloatingChatButton />
    </div>
  );
};

const Layout: React.FC = () => {
  return (
    <FilterProvider>
      <LayoutContent />
    </FilterProvider>
  );
};

export default Layout;
