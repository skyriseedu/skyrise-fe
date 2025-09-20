import React from 'react';
import { useTranslation } from 'react-i18next';

interface MissionVisionProps {
  founderImage: string;
  universityImage: string;
}

const MissionVision: React.FC<MissionVisionProps> = ({
  founderImage,
  universityImage,
}) => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white py-2 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="space-y-2 lg:hidden">
          <article>
            <div className="flex items-start justify-between px-6 pt-6">
              <h2 className="text-h3 text-text-primary font-semibold">Mission</h2>
            </div>
            <div className="px-6 pb-6 pt-4">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={founderImage}
                  alt="Skyrise Ed Founder"
                  className="h-[212px] w-full object-cover"
                />
              </div>
              <p className="text-body-3 text-text-primary mt-4">
                {t('aboutUs.mission')}
              </p>
            </div>
          </article>

          <article>
            <div className="flex items-start justify-between px-6 pt-6">
              <h2 className="text-h3 text-text-primary font-semibold">Vision</h2>
            </div>
            <div className="px-6 pb-6 pt-4">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={universityImage}
                  alt="Rangsit University"
                  className="h-[212px] w-full object-cover"
                />
              </div>
              <p className="text-body-3 text-text-primary mt-4">
                {t('aboutUs.vision')}
              </p>
            </div>
          </article>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="space-y-4">
              <h2 className="text-h3 lg:text-h2 text-text-primary font-semibold">
                Mission
              </h2>
              <p className="text-body-2 lg:text-body-3 text-text-primary">
                {t('aboutUs.mission')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-h3 lg:text-h2 text-text-primary font-semibold">
                Vision
              </h2>
              <p className="text-body-2 lg:text-body-3 text-text-primary">
                {t('aboutUs.vision')}
              </p>
            </div>
          </div>

          {/* Images Row */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-24">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={founderImage}
                alt="Skyrise Ed Founder"
                className="h-[250px] w-full object-cover lg:h-[300px]"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={universityImage}
                alt="Rangsit University"
                className="h-[250px] w-full object-cover lg:h-[300px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
