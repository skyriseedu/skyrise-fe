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
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-h1 md:text-h1 font-bold text-center mb-12 text-text-primary" style={{ fontFamily: 'var(--font-family-fustat)' }}>
          Admission Process
        </h2>

        <div className="relative">
          <div 
            className="flex justify-center overflow-x-auto md:overflow-x-visible scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 pb-4 justify-center mx-auto">
              {admissionSteps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-shrink-0">
                  <AdmissionStepCard {...step} />
                  {index < admissionSteps?.length - 1 && (
                    <div className="flex items-center mt-[5rem] md:mt-[6rem] ml-1 md:ml-2">
                      <img 
                        src={smallRectangleIcon} 
                        alt="small rectangle" 
                        className="w-10 h-4 md:w-12 md:h-5 opacity-70"
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
