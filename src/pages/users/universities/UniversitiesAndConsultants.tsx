import React, { useState } from 'react';
import UniversityTab from '../../../components/universities/UniversityTab';
import ConsultantTab from '../../../components/consultants/ConsultantTab';

const UniversitiesAndConsultants: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'universities' | 'consultants'>(
    'universities'
  );

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="bg-white lg:border-b lg:border-gray-200 lg:shadow-xl">
        <div className="w-full px-4 lg:px-12">
          <div className="py-2">
            {/* for mobile */}
            <div className="lg:hidden">
              <h1 className="text-h2 lg:text-h1 mb-4 font-semibold text-black">
                Universities & Consultants
              </h1>

              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('universities')}
                  className={`rounded-xl px-6 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'universities'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  University
                </button>
                <button
                  onClick={() => setActiveTab('consultants')}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'consultants'
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Consultants
                </button>
              </div>
            </div>

            {/* for desktop */}
            <div className="hidden border-gray-200 lg:flex lg:items-center lg:justify-start">
              <div className="lg:flex lg:justify-end">
                <h1 className="text-h1 font-semibold text-black">
                  Universities & Consultants
                </h1>
                <div className="ml-50 flex space-x-4">
                  <button
                    onClick={() => setActiveTab('universities')}
                    className={`rounded-full px-4 text-sm font-medium transition-colors ${
                      activeTab === 'universities'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    University
                  </button>
                  <button
                    onClick={() => setActiveTab('consultants')}
                    className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                      activeTab === 'consultants'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Consultants
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === 'universities' && <UniversityTab />}
        {activeTab === 'consultants' && <ConsultantTab />}
      </div>
    </div>
  );
};

export default UniversitiesAndConsultants;
