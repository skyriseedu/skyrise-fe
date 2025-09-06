import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

const GetToKnowSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full lg:py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl space-y-8 lg:max-w-none lg:text-left">
          <h2 className="text-h3 lg:text-h2 text-text-primary font-semibold">
            Get to know SkyRise
          </h2>

          <div className="space-y-6">
            <p className="text-body-2 lg:text-body-3 text-text-primary font-normal">
              Founded in 2023 in Thailand, SKYRISE Education was created by
              passionate students from Rangsit University who firmly believe
              that education is transformational for personal growth and
              unlocking limitless opportunities.
            </p>

            <p className="text-body-2 lg:text-body-3 text-text-primary font-normal">
              Driven by this vision, we created a dedicated team to empower
              students and provide a supportive, inclusive community. At
              SKYRISE, we are committed to guiding every student toward
              achieving their dreams of studying abroad and building a brighter
              future.
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
    </section>
  );
};

export default GetToKnowSection;
