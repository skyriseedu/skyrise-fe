import smallRectangleIcon from '@/assets/small-rectangle.svg';
import AdmissionStepCard from './AdmissionStepCard';

interface AdmissionStep {
  number: number;
  title: string;
}

const admissionSteps: AdmissionStep[] = [
  { number: 1, title: 'Explore\nUniversity' },
  { number: 2, title: 'Consult with\nSkyRise' },
  { number: 3, title: 'Apply with\nSkyRise' },
  { number: 4, title: 'Take Visa &\nAccommodation\nServices' },
];

export const AdmissionProcess = () => {
  return (
    <section className="bg-bg px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-h1 text-text-primary mb-12 text-center font-bold">
          Admission Process
        </h2>

        <div className="relative">
          <div className="scrollbar-hide flex overflow-x-auto md:justify-center md:overflow-x-visible">
            <div className="flex gap-4 px-4 pb-4 md:mx-auto md:justify-center md:px-0">
              {admissionSteps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-shrink-0 items-center"
                >
                  <AdmissionStepCard {...step} />
                  {index < admissionSteps?.length - 1 && (
                    <div className="mt-[5rem] ml-1 flex items-center md:mt-[6rem] md:ml-2">
                      <img
                        src={smallRectangleIcon}
                        alt="small rectangle"
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
