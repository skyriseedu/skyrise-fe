import React from 'react';
import SkyRiseLogo from '../../assets/skyrise-logo-2.svg?react';
import CloseIcon from '../../assets/chat-close.svg?react';

interface ChatBoxProps {
  onClose: () => void;
}

const quickQuestions = ['Question 1', 'Question 2', 'Question 3', 'Question 4'];

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  const headingId = 'chatbox-heading';
  const descriptionId = 'chatbox-description';

  const handleBackdropClick = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-4 sm:items-center lg:items-center lg:justify-end lg:bg-transparent lg:p-0 lg:pr-24 lg:py-16 lg:pointer-events-none"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl lg:max-w-lg lg:rounded-[32px] lg:border lg:border-neutral-200 lg:shadow-[0px_28px_60px_-20px_rgba(28,24,49,0.35)] lg:pointer-events-auto"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
      >
        <div className="relative px-6 pb-8 pt-8 text-center lg:px-12 lg:pb-12 lg:pt-12">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 text-primary transition hover:opacity-80 lg:hidden"
            aria-label="Close chat"
          >
            <CloseIcon className="h-6 w-6" />
          </button>

          <div className="mb-6 flex justify-center lg:mb-8">
            <SkyRiseLogo className="h-20 w-20 lg:h-24 lg:w-24" />
          </div>

          <h2 id={headingId} className="text-xl font-semibold text-neutral-900 lg:text-2xl">
            Hi! Good Morning!
            <br />
            What is your questions?
          </h2>
          <p id={descriptionId} className="mt-3 text-sm text-neutral-500 lg:text-base">
            Choose sample questions below or write on your own to start chatting with us.
          </p>

          <div className="mt-8 space-y-3 lg:mt-10">
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {quickQuestions.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-2xl bg-primary/10 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-primary/20 lg:px-8"
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="w-full rounded-2xl bg-primary/10 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-primary/20 lg:px-8"
            >
              Question 5
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
