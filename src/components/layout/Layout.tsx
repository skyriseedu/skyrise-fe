import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import FloatingChatButton from './FloatingChatButton';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
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

export default Layout;
