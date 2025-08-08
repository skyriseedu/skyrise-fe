import React from 'react';

interface Reason {
  number: number;
  title: string;
  subtitle?: string;
  textColor?: string;
  backgroundColor?: string;
}

interface ProcessStep {
  number: number;
  title: string;
  subtitle?: string;
}

interface WhyChooseUsProps {
  title?: string;
  subtitle?: string;
  reasons?: Reason[];
  processTitle?: string;
  processSteps?: ProcessStep[];
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({
  title = 'Why Choose Us',
  subtitle = 'We created this space because we hate overrated reviews and sugar-coated promotions just as much as you do. Instead, we believe in making you find',
  reasons = [
    {
      number: 1,
      title: 'Genuine experiences shared by seniors',
      textColor: 'text-[var(--color-text-primary)]',
    },
    {
      number: 2,
      title: 'Clear path to your best-fit university',
      textColor: 'text-[var(--color-primary)]',
      backgroundColor: 'bg-[var(--color-secondary)]',
    },
    {
      number: 3,
      title: 'Personal guidance you can rely on',
      textColor: 'text-[var(--color-text-primary)]',
    },
    {
      number: 4,
      title: 'Inspiring community that grows with you',
      textColor: 'text-[var(--color-primary)]',
      backgroundColor: 'bg-[var(--color-secondary)]',
    },
  ],
}) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-h1 mb-6 font-semibold text-[var(--color-text-primary)]">
          {title}
        </h2>
        <p className="text-body-3 mx-auto max-w-3xl leading-relaxed text-[var(--color-text-primary)]">
          {subtitle}
        </p>
      </div>

      <div className="mb-20 grid grid-cols-4 gap-2 md:gap-4">
        {reasons?.map((reason) => (
          <div
            key={reason.number}
            className={`relative rounded-[var(--border-radius)] p-3 text-center sm:p-4 md:p-8 ${reason.backgroundColor || ''}`}
          >
            <h3
              className={`mb-2 text-[24px] font-semibold sm:text-[24px] md:mb-4 md:text-[40px] ${reason.textColor}`}
            >
              {reason.number}
            </h3>
            <p
              className={`text-body-4 leading-tight font-semibold break-words ${reason.textColor}`}
            >
              {reason.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
