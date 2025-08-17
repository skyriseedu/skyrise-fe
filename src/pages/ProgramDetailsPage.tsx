import React from 'react';
import { useNavigate } from 'react-router-dom';
import KeyInfoCard from '@/components/program-details/KeyInfoCard';
import arrowLeft from '@/assets/arrow-left.svg';
import ReviewsSection from '@/components/reviews/ReviewsSection';

const ProgramDetailsPage: React.FC = () => {
  const navigate = useNavigate();

  const programData = {
    title: 'Bachelor of Science in Information and Communication Technology',
    description: 'The Information and Communication Technology (ICT) program encourages students to think critically and creatively as they learn how to find, process, and apply the vast amounts of information available in today\'s connected, digital world.',
    keyInfo: [
      {
        icon: '🎓',
        label: 'Degree',
        value: 'Bachelor'
      },
      {
        icon: '📅',
        label: 'Duration',
        value: '4 years'
      },
      {
        icon: '📍',
        label: 'Location',
        value: 'Bangkok'
      },
      {
        icon: '💼',
        label: 'Application Fees',
        value: 'Charged'
      },
      {
        icon: '📆',
        label: 'Upcoming Intake',
        value: 'August 2025'
      },
      {
        icon: '💰',
        label: 'Total Tuition Fee',
        value: '600,000 THB'
      }
    ]
  };

  return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="lg:hidden -mx-4 px-4 pb-4 mb-8 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate(-1)}
                className="mt-1"
              >
                <img src={arrowLeft} alt="Back" className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-800 leading-tight">
                  {programData.title}
                </h1>
                <p className="text-gray-500 text-sm mt-2">Rangsit University</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 mb-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center"
            >
              <img src={arrowLeft} alt="Back" className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">{programData.title}</h2>
          </div>

          {/* Program Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-12 lg:mb-20">
            <div className="relative flex-shrink-0 w-full lg:w-auto">
              <div className="relative w-[240px] h-[240px] lg:w-[380px] lg:h-[380px] mx-auto lg:mx-0">
                <div className="absolute bottom-0 right-0 w-44 h-44 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&h=500&fit=crop" 
                    alt="Programming"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-green-400 font-mono text-[11px] lg:text-base text-center">
                      <div>const program = {`{`}</div>
                      <div className="lg:ml-4">type: 'ICT',</div>
                      <div className="lg:ml-4">skills: ['web', 'code']</div>
                      <div>{`}`};</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-0 left-0 w-28 h-28 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl z-10"
                     style={{
                       top: '15%',
                       left: '-5%'
                     }}>
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop" 
                    alt="Web Design"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg font-bold">WEB DESIGN</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-2xl px-4 lg:px-0">
              <h2 className="text-2xl lg:text-4xl font-bold mb-4 lg:mb-6 text-gray-800">About Program</h2>
              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                {programData.description}
              </p>
            </div>
          </div>

          {/* Key Information Section */}
          <div className="py-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gray-800">Key Information</h2>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[0].icon}
                  label={programData.keyInfo[0].label}
                  value={programData.keyInfo[0].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[1].icon}
                  label={programData.keyInfo[1].label}
                  value={programData.keyInfo[1].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[2].icon}
                  label={programData.keyInfo[2].label}
                  value={programData.keyInfo[2].value}
                />
              </div>
              
              <div className="col-span-2 lg:col-span-1 lg:row-span-2 h-24 lg:h-auto order-last lg:order-none">
                <div className="bg-[#E94B5C] rounded-xl h-full flex flex-col items-center justify-center text-white cursor-pointer hover:bg-[#d43d4e] transition-colors">
                  <div className="text-center">
                    <div className="text-xl lg:text-3xl font-bold">Book</div>
                    <div className="text-xl lg:text-3xl font-bold">Free</div>
                    <div className="text-xl lg:text-3xl font-bold">Consultation</div>
                  </div>
                </div>
              </div>
              
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[3].icon}
                  label={programData.keyInfo[3].label}
                  value={programData.keyInfo[3].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[4].icon}
                  label={programData.keyInfo[4].label}
                  value={programData.keyInfo[4].value}
                />
              </div>
              <div className="h-20 lg:h-24">
                <KeyInfoCard
                  icon={programData.keyInfo[5].icon}
                  label={programData.keyInfo[5].label}
                  value={programData.keyInfo[5].value}
                />
              </div>
              </div>
            </div>
          </div>
        </div>
        <ReviewsSection />
      </div>
  );
};

export default ProgramDetailsPage;