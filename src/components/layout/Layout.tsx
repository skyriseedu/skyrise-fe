import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import FloatingChatButton from './FloatingChatButton';
import { useFilterStore } from '@/store/useFilterStore';

const LayoutContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsMobileFilterOpen } = useFilterStore();
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/explore')) return 'Explore';
    if (path === '/about') return 'About Us';
    if (path === '/universities-and-consultants') return 'Universities & Consultants';
    if (path.startsWith('/universities-and-consultants/')) return 'University Details';
    if (path.startsWith('/programs/')) return 'Program Details';
    if (path.startsWith('/services/')) {
      if (path.endsWith('/university-application')) return 'University Application';
      if (path.endsWith('/visa-assistance')) return 'Visa Assistance';
      if (path.endsWith('/consultation')) return 'Consultation';
      if (path.endsWith('/scholarships')) return 'Scholarships';
      return 'Services';
    }
    if (path === '/blogs') return 'Blogs';
    if (path.startsWith('/blogs/')) return 'Blog Details';
    return undefined;
  }, [location.pathname]);

  useEffect(() => {
    document.title = pageTitle ? `Skyrise | ${pageTitle}` : 'Skyrise';
  }, [pageTitle]);

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
  return <LayoutContent />;
};

export default Layout;
