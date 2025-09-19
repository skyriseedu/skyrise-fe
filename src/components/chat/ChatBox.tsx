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

  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBackdropClick = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[88px] z-[60] flex items-start justify-center bg-white px-4 pb-4 sm:p-4 lg:inset-0 lg:items-center lg:justify-end lg:bg-transparent lg:p-0 lg:pr-16 lg:py-8 lg:pointer-events-none xl:pr-24 xl:py-10"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-3xl transition-all duration-300 ease-out md:h-[573px] md:w-[400px] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
      >
        <div className="relative flex-1 overflow-y-auto px-6 pb-20 pt-8 text-center lg:px-8 lg:pt-10 xl:px-12 xl:pt-12">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 text-primary transition hover:opacity-80 lg:hidden"
            aria-label="Close chat"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <div className="mb-6 flex justify-center lg:mb-6 xl:mb-8">
            <SkyRiseLogo className="h-20 w-20 lg:h-20 lg:w-20 xl:h-24 xl:w-24" />
          </div>

          <h2 id={headingId} className="text-xl font-semibold text-neutral-900 lg:text-xl xl:text-2xl">
            Hi! Good Morning!
            <br />
            What is your questions?
          </h2>
          <p id={descriptionId} className="mt-3 text-sm text-neutral-500 lg:text-sm xl:text-base">
            Choose sample questions below to start chatting with us.
          </p>

        </div>

        <div className='px-6 pb-8 lg:px-6'>
          <div className="grid grid-cols-2 gap-3 lg:gap-3.5 xl:gap-4">
            {quickQuestions.map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-2xl bg-primary/10 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-primary/20 lg:px-6 lg:py-2.5 xl:px-8 xl:py-3"
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-2xl bg-primary/10 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-primary/20 lg:mt-3 lg:px-6 lg:py-2.5 xl:mt-4 xl:px-8 xl:py-3"
          >
            Question 5
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
