import React from 'react';

interface MissionVisionProps {
  founderImage: string;
  universityImage: string;
}

const MissionVision: React.FC<MissionVisionProps> = ({ founderImage, universityImage }) => {
  return (
    <section className="w-full py-10 lg:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          <div className="overflow-hidden">
            <div className="flex">
              <div className="w-1/2 p-6 flex flex-col justify-center">
                <h2 className="text-h3 lg:text-h2 font-semibold text-text-primary mb-3">Mission</h2>
                <p className="text-body-2 lg:text-body-3 text-text-primary">
                  At Skyrise Ed, we're on a mission to make studying abroad feel possible, personal, and 
                  real by giving you honest guidance without sugar-coating.
                </p>
              </div>
              <div className="w-1/2 p-4">
                <img 
                  src={founderImage} 
                  alt="Skyrise Ed Founder" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Vision Section - Mobile */}
          <div className="overflow-hidden">
            <div className="flex">
              <div className="w-1/2 p-2">
                <img 
                  src={universityImage} 
                  alt="Rangsit University" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="w-1/2 p-6 flex flex-col justify-center">
                <h2 className="text-h3 lg:text-h2 font-semibold text-text-primary mb-3">Vision</h2>
                <p className="text-body-2 lg:text-body-3 text-text-primary">
                  Our vision is to be the leading trusted platform in education admissions, 
                  where every student finds not just guidance, but also feels empowered and 
                  inspired. We believe in the joy of learning, the power of growth, and the life-
                  changing impact of education—and we are here to help you experience it 
                  too.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-12">
            <div className="space-y-4">
              <h2 className="text-h3 lg:text-h2 font-semibold text-text-primary">Mission</h2>
              <p className="text-body-2 lg:text-body-3 text-text-primary">
                At Skyrise Ed, we're on a mission to make studying abroad feel possible, personal, and 
                real by giving you honest guidance without sugar-coating.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-h3 lg:text-h2 font-semibold text-text-primary">Vision</h2>
              <p className="text-body-2 lg:text-body-3 text-text-primary">
                Our vision is to be the leading trusted platform in education admissions, 
                where every student finds not just guidance, but also feels empowered and 
                inspired. We believe in the joy of learning, the power of growth, and the life-
                changing impact of education—and we are here to help you experience it 
                too.
              </p>
            </div>
          </div>

          {/* Images Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img 
                src={founderImage} 
                alt="Skyrise Ed Founder" 
                className="w-full h-[250px] lg:h-[300px] object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img 
                src={universityImage} 
                alt="Rangsit University" 
                className="w-full h-[250px] lg:h-[300px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;