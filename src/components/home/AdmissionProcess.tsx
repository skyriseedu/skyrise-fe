import { useTranslation } from 'react-i18next';
import smallRectangleIcon from '@/assets/small-rectangle.svg';
import AdmissionStepCard from './AdmissionStepCard';

interface AdmissionStep {
  number: string;
  title: string;
}

export const AdmissionProcess = () => {
  const { t } = useTranslation();

  const admissionSteps: AdmissionStep[] = [
    {
      number: t('home.admissionProcess.steps.1.number'),
      title: t('home.admissionProcess.steps.1.title'),
    },
    {
      number: t('home.admissionProcess.steps.2.number'),
      title: t('home.admissionProcess.steps.2.title'),
    },
    {
      number: t('home.admissionProcess.steps.3.number'),
      title: t('home.admissionProcess.steps.3.title'),
    },
    {
      number: t('home.admissionProcess.steps.4.number'),
      title: t('home.admissionProcess.steps.4.title'),
    },
  ];
  return (
    <section className="bg-bg mb-2 px-6 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-h1 text-text-primary mb-12 text-center font-semibold lg:text-h1">
          {t('home.admissionProcess.title')}
        </h2>

        <div className="relative mt-14">
          <div className="scrollbar-hide flex overflow-x-auto md:justify-center md:overflow-x-visible">
            <div className="flex gap-4 px-4 pb-4 md:mx-auto md:justify-center md:px-0">
              {admissionSteps?.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-shrink-0 items-center"
                >
                  <AdmissionStepCard {...step} />
                  {index < admissionSteps?.length - 1 && (
                    <div className="mt-[5rem] ml-1 flex items-center md:mt-[6rem] md:ml-2">
                      <img
                        src={smallRectangleIcon}
                        alt={t('home.admissionProcess.icons.smallRectangle')}
                        className="h-4 w-10 opacity-70 md:h-5 md:w-12"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
