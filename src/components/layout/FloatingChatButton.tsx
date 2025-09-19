import React, { useCallback, useEffect, useState } from 'react';
import MessageQuestion from '../../assets/message-question.svg?react';
import CloseIcon from '../../assets/chat-close.svg?react';
import ChatBox from '../chat/ChatBox';
import { useFilterStore } from '@/store/useFilterStore';

const FloatingChatButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { isMobileFilterOpen } = useFilterStore();

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    setIsHovered(false);
  }, []);

  const handleChatClick = () => {
    if (isChatOpen) {
      handleCloseChat();
      return;
    }

    setIsChatOpen(true);
  };

  useEffect(() => {
    if (!isChatOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseChat, isChatOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (isMobileFilterOpen) return null;

  const shouldHideButton = isChatOpen && !isDesktop;

  return (
    <>
      {!shouldHideButton && (
        <button
          onClick={handleChatClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-primary fixed border-white border-1 cursor-pointer right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl lg:right-10 lg:bottom-16 lg:h-14 lg:w-14 xl:right-13 xl:bottom-10 xl:h-16 xl:w-16 ${
            isHovered ? 'bg-primary/90' : 'bg-primary'
          }`}
          aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        >
          {isChatOpen ? (
            <CloseIcon className="h-5 w-5 text-white xl:h-6 xl:w-6" />
          ) : (
            <MessageQuestion className="h-5 w-5 text-white xl:h-6 xl:w-6" />
          )}
          {!isChatOpen && <div className="bg-primary absolute inset-0 animate-ping rounded-full opacity-20" />}
        </button>
      )}

      {isChatOpen && <ChatBox onClose={handleCloseChat} />}
    </>
  );
};

export default FloatingChatButton;
