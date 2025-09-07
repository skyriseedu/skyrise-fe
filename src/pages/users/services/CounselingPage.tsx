import React from 'react';
import ServicesShowcase from '@/components/services/consultation/ServicesShowcase';
import Button from '@/components/common/Button';

const CounselingPage: React.FC = () => {

  return (
    <div className="min-h-screen">
        <section className="container mx-auto px-4 py-8">
        <div>
          <p className="text-text-primary text-body-2 lg:text-body-3 mb-10">
            Not Sure where to start? Seniors from your dream universities are helping to share genuine reviews <br />
            and insightful information for you to start your academic journey in Thailand with clarity and <br/>
            confidence.
          </p>
          
          <div className="mb-8">
            <h2 className="text-h4 lg:text-h2 font-semibold text-text-primary mb-6">We Offer :</h2>
            
            <ul className="mb-8">
              <li className="flex items-start mb-3">
                <span className="text-text-primary mr-2">•</span>
                <span className="text-text-primary text-h4 lg:text-body-3">One-on-one free consultation</span>
              </li>
            </ul>
            
            <div className="flex gap-2">
              <Button 
                className="bg-primary shadow-lg text-white px-8 py-3 rounded-[20px] cursor-pointer"
                primary={false}
              >
                Book Free Consultation
              </Button>
              
              <Button 
                secondary
                className="px-8 py-3 shadow-lg rounded-[20px] cursor-pointer text-text-primary"
              >
                Explore University
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ServicesShowcase />    
    </div>
  );
};

export default CounselingPage;
