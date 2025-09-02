import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

const GetToKnowSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-16 px-6 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="lg:text-left space-y-8 max-w-4xl lg:max-w-none">
          <h2 className="text-h3 lg:text-h2 font-semibold text-text-primary">
            Get to know SkyRise
          </h2>
          
          <div className="space-y-6">
            <p className="text-body-2 lg:text-body-3 font-normal text-text-primary ">
              Founded in 2023 in Thailand, SKYRISE Education was created by passionate students from Rangsit 
              University who firmly believe that education is transformational for personal growth and unlocking 
              limitless opportunities.
            </p>
            
            <p className="text-body-2 lg:text-body-3 font-normal text-text-primary">
              Driven by this vision, we created a dedicated team to empower students and provide a supportive, 
              inclusive community. At SKYRISE, we are committed to guiding every student toward achieving their 
              dreams of studying abroad and building a brighter future.
            </p>
          </div>
          
          <div className="pt-8 flex justify-center lg:justify-start">
            <Button
              size="lg"
              className="w-full sm:w-auto min-w-[300px]"
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