import React, { useCallback, useEffect, useState } from 'react';
import MessageQuestion from '../../assets/message-question.svg?react';
import CloseIcon from '../../assets/chat-close.svg?react';
import ChatBox from '../chat/ChatBox';
import { useFilterStore } from '@/store/useFilterStore';

const FloatingChatButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  if (isMobileFilterOpen) return null;

  return (
    <>
      <button
        onClick={handleChatClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-primary fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl lg:right-15 lg:bottom-15 lg:h-16 lg:w-16 ${
          isHovered ? 'bg-primary/90' : 'bg-primary'
        }`}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {isChatOpen ? (
          <CloseIcon className="h-5 w-5 text-white lg:h-4 lg:w-4" />
        ) : (
          <MessageQuestion className="h-5 w-5 text-white lg:h-6 lg:w-6" />
        )}
        {!isChatOpen && <div className="bg-primary absolute inset-0 animate-ping rounded-full opacity-20" />}
      </button>

      {isChatOpen && <ChatBox onClose={handleCloseChat} />}
    </>
  );
};

export default FloatingChatButton;
