import React from 'react';
import SkyRiseLogo from '../../assets/skyrise-logo-2.svg?react';
import CloseIcon from '../../assets/chat-close.svg?react';
import StickyHeader from '../common/StickyHeader';

interface ChatBoxProps {
  onClose: () => void;
}

const quickQuestions = [
  {
    id: 'question-1',
    label: 'Question 1',
    answer:
      "Q1's answer goes here. You can replace this copy with the real response you want to surface when the user taps Question 1.",
  },
  {
    id: 'question-2',
    label: 'Question 2',
    answer:
      'Placeholder answer for Question 2. Expand this with your actual FAQ content.',
  },
  {
    id: 'question-3',
    label: 'Question 3',
    answer:
      'Placeholder answer for Question 3. Expand this with your actual FAQ content.',
  },
  {
    id: 'question-4',
    label: 'Question 4',
    answer:
      'Placeholder answer for Question 4. Expand this with your actual FAQ content.',
  },
  {
    id: 'question-5',
    label: 'Question 5',
    answer:
      'Placeholder answer for Question 5. Expand this with your actual FAQ content.',
  },
];

type MessageAuthor = 'assistant' | 'user';

interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  const headingId = 'chatbox-heading';
  const descriptionId = 'chatbox-description';

  const [isVisible, setIsVisible] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  React.useEffect(() => {
    if (!messagesEndRef.current) {
      return;
    }

    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuestionClick = (
    conversation: (typeof quickQuestions)[number]
  ) => {
    setMessages((previous) => [
      ...previous,
      {
        id: `${conversation.id}-answer-${previous.length}`,
        author: 'assistant',
        text: conversation.answer,
      },
      {
        id: `${conversation.id}-question-${previous.length}`,
        author: 'user',
        text: conversation.label,
      },
    ]);
  };

  const handleBackdropClick = () => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches
    ) {
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-x-0 top-[88px] bottom-0 z-[60] flex items-start justify-center bg-white px-4 pb-4 sm:p-4 lg:pointer-events-none lg:inset-0 lg:items-center lg:justify-end lg:bg-transparent lg:p-0 lg:py-8 lg:pr-16 xl:py-10 xl:pr-24"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={`shadow-3xl relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white transition-all duration-300 ease-out md:h-[573px] md:w-[400px] lg:pointer-events-auto ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.98] opacity-0'}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          {messages.length > 0 && (
            <StickyHeader
              showBackButton={false}
              useContainer={false}
              mobilePadding="px-6"
              desktopPadding="px-6"
              topClassName="top-0"
              className="border-b-1 border-gray-200 shadow-sm"
            >
              <div className="flex flex-row gap-2 text-left">
                <SkyRiseLogo className="h-7 w-7" />
                <p className="mt-1 text-sm font-medium text-neutral-600">
                  SkyRise is answering for you...
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-primary absolute top-0 right-4 transition hover:opacity-80 lg:hidden"
                aria-label="Close chat"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </StickyHeader>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-primary absolute top-0 right-4 transition hover:opacity-80 lg:hidden"
            aria-label="Close chat"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <div
            className={`flex-1 overflow-y-auto px-6 pb-20 ${messages.length > 0 ? 'pt-5 text-left' : 'pt-4 text-center'} lg:px-4 xl:px-6`}
          >
            {messages.length > 0 ? (
              <div className="flex flex-col gap-6">
                {messages.map((message) => {
                  if (message.author === 'assistant') {
                    return (
                      <div key={message.id} className="flex items-start gap-1">
                        <SkyRiseLogo className="h-9 w-9 shrink-0" />
                        <div className="bg-primary/10 text-text-primary relative max-w-[65%] rounded-xl px-2 py-2 text-sm shadow-sm">
                          {message.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="bg-primary/10 text-text-primary relative max-w-[85%] rounded-xl px-2 py-3 text-sm shadow-sm">
                        {message.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-center lg:mb-6 xl:mb-8">
                  <SkyRiseLogo className="h-20 w-20 lg:h-20 lg:w-20 xl:h-24 xl:w-24" />
                </div>

                <h2
                  id={headingId}
                  className="text-xl font-semibold text-neutral-900 lg:text-xl xl:text-2xl"
                >
                  Hi! Good Morning!
                  <br />
                  What is your questions?
                </h2>
                <p
                  id={descriptionId}
                  className="mt-3 text-sm text-neutral-500 lg:text-sm xl:text-base"
                >
                  Choose sample questions below to start chatting with us.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="px-6 pb-8 lg:px-6">
          <div className="grid grid-cols-2 gap-3 lg:gap-3.5 xl:gap-4">
            {quickQuestions?.slice(0, 4).map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => handleQuestionClick(conversation)}
                className="bg-primary/10 hover:bg-primary/20 focus-visible:outline-primary cursor-pointer rounded-xl px-6 py-3 text-sm font-medium text-neutral-700 transition focus-visible:outline-2 focus-visible:outline-offset-2 lg:px-6 lg:py-2.5 xl:px-8 xl:py-3"
              >
                {conversation.label}
              </button>
            ))}
          </div>
          {quickQuestions[4] && (
            <button
              type="button"
              onClick={() => handleQuestionClick(quickQuestions[4])}
              className="bg-primary/10 hover:bg-primary/20 focus-visible:outline-primary mt-3 w-full cursor-pointer rounded-xl px-6 py-3 text-sm font-medium text-neutral-700 transition focus-visible:outline-2 focus-visible:outline-offset-2 lg:mt-3 lg:px-6 lg:py-2.5 xl:mt-4 xl:px-8 xl:py-3"
            >
              {quickQuestions[4].label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
