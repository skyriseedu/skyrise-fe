import React, { useState } from 'react';
import MessageQuestion from '../../assets/message-question.svg?react';
import { useFilter } from '@/contexts/FilterContext';

const FloatingChatButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isMobileFilterOpen } = useFilter();

  const handleChatClick = () => {
    console.log('Opening chat...');
  };

  // Hide the button when mobile filter is open
  if (isMobileFilterOpen) return null;

  return (
    <button
      onClick={handleChatClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-primary fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
        isHovered ? 'bg-primary/90' : 'bg-primary'
      }`}
      aria-label="Open chat"
    >
      <MessageQuestion className="h-6 w-6 text-white" />
      <div className="bg-primary absolute inset-0 animate-ping rounded-full opacity-20" />
    </button>
  );
};

export default FloatingChatButton;
