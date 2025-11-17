import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useFaqs } from '@/queries';
import type { FaqItem } from '@/types/users/faqs';

import SkyRiseLogo from '../../assets/skyrise-logo-2.svg?react';
import CloseIcon from '../../assets/chat-close.svg?react';
import StickyHeader from '../common/StickyHeader';

interface ChatBoxProps {
  onClose: () => void;
}

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
  const [showContactCard, setShowContactCard] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { data: faqsResponse, isPending: isFaqsLoading } = useFaqs(1, 10);

  const faqs = React.useMemo(
    () => faqsResponse?.data?.faqs ?? [],
    [faqsResponse]
  );

  const gridQuestions = faqs.slice(0, 4);
  const bottomQuestion = faqs.slice(4, 5)[0];

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
    conversation: FaqItem,
    openContactCard = false
  ) => {
    setShowContactCard(openContactCard);
    setMessages((previous) => [
      ...previous,
      {
        id: `${conversation._id}-question-${previous.length}`,
        author: 'user',
        text: conversation.question,
      },
      {
        id: `${conversation._id}-answer-${previous.length}`,
        author: 'assistant',
        text: conversation.answer,
      },
    ]);
  };

  // const handleContactClick = () => {
  //   setShowContactCard(true);
  // };

  const handleBookConsultation = () => {
    navigate('/services/consultation');
    onClose();
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
                  SKYRISE is answering for you...
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
                {messages?.map((message) => {
                  if (message.author === 'assistant') {
                    return (
                      <div key={message.id} className="flex items-start gap-1">
                        <SkyRiseLogo className="h-9 w-9 shrink-0" />
                        <div className="bg-primary/10 text-text-primary relative max-w-[65%] rounded-xl px-2 py-2 text-sm whitespace-pre-line shadow-sm">
                          {message.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="bg-primary/10 text-text-primary relative max-w-[85%] rounded-xl px-2 py-3 text-sm whitespace-pre-line shadow-sm">
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

        <div className="px-6 pb-6 lg:px-6">
          {showContactCard ? (
            <div className="text-text-primary rounded-3xl bg-[#FFE6E8] px-6 py-6 text-center shadow-lg">
              <p className="text-body-3">
                Please contact us{' '}
                <a
                  href="https://www.facebook.com/share/15HjhMzHVKE/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  here (SKYRISE Corner Facebook Page)
                </a>{' '}
                for further information
              </p>
              <p className="text-body-4 mt-4 font-semibold text-neutral-700">
                OR
              </p>
              <button
                type="button"
                onClick={handleBookConsultation}
                className="bg-primary hover:bg-primary/90 text-body-h4 mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-[10px] px-6 py-3 font-semibold text-white"
              >
                Book Free Consultation
              </button>
            </div>
          ) : (
            <>
              {isFaqsLoading ? (
                <p className="text-center text-sm text-neutral-500">
                  Loading quick questions...
                </p>
              ) : faqs.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-3 pt-1 lg:gap-3.5 xl:gap-2">
                    {gridQuestions?.map((conversation) => (
                      <button
                        key={conversation._id}
                        type="button"
                        onClick={() => handleQuestionClick(conversation)}
                        className="bg-primary/10 hover:bg-primary/20 focus-visible:outline-primary text-text-primary w-auto cursor-pointer rounded-xl px-2 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 lg:max-w-[165px] lg:px-4 lg:py-2.5 lg:text-xs xl:px-4 xl:py-2"
                      >
                        {conversation.question}
                      </button>
                    ))}
                  </div>
                  {bottomQuestion && (
                    <button
                      type="button"
                      onClick={() => handleQuestionClick(bottomQuestion, true)}
                      className="bg-primary/10 hover:bg-primary/20 focus-visible:outline-primary text-text-primary mt-3 w-full cursor-pointer rounded-xl px-6 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 lg:mt-2 lg:px-6 lg:py-2.5 lg:text-xs xl:mt-2 xl:px-4 xl:py-3"
                    >
                      {bottomQuestion.question}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-center text-sm text-neutral-500">
                  No quick questions available right now.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
