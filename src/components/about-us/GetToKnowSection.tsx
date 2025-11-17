import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import aboutCover1 from '@/assets/images/about-us-cover-one.jpg';
import aboutCover2 from '@/assets/images/about-us-cover-two.jpg';
import aboutCover3 from '@/assets/images/about-us-cover-three.jpg';
import { useTranslation } from 'react-i18next';

const GetToKnowSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="w-full">
      {/* Images Section */}
      <div className="relative w-full">
        <div className="grid grid-cols-3 gap-0 px-0">
          <div className="h-[280px] w-full md:h-[250px] lg:h-[450px]">
            <img
              src={aboutCover1}
              alt="About us cover 1"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-[280px] w-full md:h-[250px] lg:h-[450px]">
            <img
              src={aboutCover2}
              alt="About us cover 2"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-[280px] w-full md:h-[250px] lg:h-[450px]">
            <img
              src={aboutCover3}
              alt="About us cover 3"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-4 py-2 md:py-2 lg:bottom-8 lg:py-2"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="container mx-auto px-6 text-left lg:px-8">
            <h1 className="text-h3 md:text-h2 lg:text-h2 font-semibold text-white">
              "Built for Students. Guided by <br className="md:block" />
              Experience. Driven by Purpose."
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl space-y-8 lg:max-w-none lg:text-left">
            <h2 className="text-h3 lg:text-h2 text-text-primary font-semibold">
              Get to know SKYRISE
            </h2>

            <div className="space-y-6">
              <p className="text-body-2 lg:text-body-3 text-text-primary">
                {t('aboutUs.storyOne')}
              </p>

              <p className="text-body-2 lg:text-body-3 text-text-primary">
                {t('aboutUs.storyTwo')}
              </p>
            </div>

            <div className="flex justify-center pt-8 lg:justify-start">
              <Button
                size="lg"
                className="w-full min-w-[300px] sm:w-auto"
                onClick={() => navigate('/explore')}
              >
                Search University
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetToKnowSection;
