import React from 'react';
import { useTranslation } from 'react-i18next';

const WhyChooseUs: React.FC = () => {
  const { t } = useTranslation();

  const reasons = [
    {
      number: 1,
      title: t('home.whyChooseUs.points.1'),
      textColor: 'text-text-primary',
    },
    {
      number: 2,
      title: t('home.whyChooseUs.points.2'),
      textColor: 'text-primary md:text-primary',
      backgroundColor: 'bg-secondary',
    },
    {
      number: 3,
      title: t('home.whyChooseUs.points.3'),
      textColor: 'text-primary md:text-text-primary',
      backgroundColor: 'bg-secondary md:bg-transparent',
    },
    {
      number: 4,
      title: t('home.whyChooseUs.points.4'),
      textColor: 'text-text-primary md:text-primary',
      backgroundColor: 'md:bg-secondary',
    },
  ];
  return (
    <div className="mx-auto mt-14 mb-10 max-w-6xl px-4">
      <div className="mb-12 text-center">
        <h2 className="text-h1 text-text-primary mb-6 font-semibold lg:text-h1">
          {t('home.whyChooseUs.title')}
        </h2>
        <p className="text-body-4 lg:text-body-2 text-text-primary mx-auto max-w-3xl leading-relaxed">
          {t('home.whyChooseUs.description')}
        </p>
      </div>

      <div className="mb-20 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {reasons?.map((reason) => (
          <div
            key={reason?.number}
            className={`relative rounded-[10px] p-3 text-center sm:p-4 md:p-8 ${reason.backgroundColor || ''}`}
          >
            <h3
              className={`text-h1 mb-2 font-semibold md:mb-4 lg:text-[40px] ${reason.textColor}`}
            >
              {reason?.number}
            </h3>
            <p
              className={`text-body-5 lg:text-body-3 leading-tight font-semibold break-words ${reason.textColor}`}
            >
              {reason?.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
