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
  title = "Why Choose Us",
  subtitle = "We created this space because we hate overrated reviews and sugar-coated promotions just as much as you do. Instead, we believe in making you find",
  reasons = [
    {
      number: 1,
      title: "Genuine experiences shared by seniors",
      textColor: "text-[var(--color-text-primary)]"
    },
    {
      number: 2,
      title: "Clear path to your best-fit university",
      textColor: "text-[var(--color-primary)]",
      backgroundColor: "bg-[var(--color-secondary)]"
    },
    {
      number: 3,
      title: "Personal guidance you can rely on",
      textColor: "text-[var(--color-text-primary)]"
    },
    {
      number: 4,
      title: "Inspiring community that grows with you",
      textColor: "text-[var(--color-primary)]",
      backgroundColor: "bg-[var(--color-secondary)]"
    }
  ]
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-h1 font-semibold text-[var(--color-text-primary)] mb-6">
          {title}
        </h2>
        <p className="text-body-3 text-[var(--color-text-primary)] max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-20">
        {reasons?.map((reason) => (
          <div
            key={reason.number}
            className={`relative p-3 sm:p-4 md:p-8 text-center rounded-[var(--border-radius)] ${reason.backgroundColor || ''}`}
          >
            <h3 className={`text-[24px] sm:text-[24px] md:text-[48px] font-semibold mb-2 md:mb-4 ${reason.textColor}`}>
              {reason.number}
            </h3>
            <p className={`text-font-size-body-4] sm:text-body-5 md:text-body-3 font-semibold leading-tight break-words ${reason.textColor}`}>
              {reason.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;