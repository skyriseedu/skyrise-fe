import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import UniversityTab from '../../../components/universities/UniversityTab';
import ConsultantTab from '../../../components/consultants/ConsultantTab';

const UniversitiesAndConsultants: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab =
    searchParams.get('tab') === 'consultants' ? 'consultants' : 'universities';
  const [activeTab, setActiveTab] =
    useState<'universities' | 'consultants'>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'consultants' || tabParam === 'universities') {
      setActiveTab((prev) => (prev === tabParam ? prev : tabParam));
      return;
    }

    setActiveTab((prev) => (prev === 'universities' ? prev : 'universities'));

    if (!tabParam) {
      const params = new URLSearchParams(searchParams);
      params.set('tab', 'universities');
      setSearchParams(params);
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (tab: 'universities' | 'consultants') => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="bg-white lg:border-b lg:border-gray-200 lg:shadow-xl">
        <div className="w-full px-4 lg:px-12">
          <div className="py-2">
            {/* for mobile */}
            <div className="lg:hidden">
              <h1 className="text-h2 lg:text-h1 text-text-primary mb-4 font-semibold">
                Universities & Consultants
              </h1>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleTabChange('universities')}
                  className={`text-h4 md:text-h2 cursor-pointer rounded-lg px-6 py-2 font-semibold transition-colors ${
                    activeTab === 'universities'
                      ? 'bg-primary text-white'
                      : 'text-text-primary hover:bg-secondary'
                  }`}
                >
                  University
                </button>
                <button
                  onClick={() => handleTabChange('consultants')}
                  className={`text-h4 md:text-h2 cursor-pointer rounded-lg px-6 py-2 font-semibold transition-colors ${
                    activeTab === 'consultants'
                      ? 'bg-primary text-white'
                      : 'text-text-primary hover:bg-secondary'
                  }`}
                >
                  Consultants
                </button>
              </div>
            </div>

            {/* for desktop */}
            <div className="hidden border-gray-200 lg:flex lg:items-center lg:justify-start">
              <div className="lg:flex lg:justify-end">
                <h1 className="text-h2 font-semibold text-black">
                  Universities & Consultants
                </h1>
                <div className="ml-50 flex space-x-4">
                  <button
                    onClick={() => handleTabChange('universities')}
                    className={`text-h4 md:text-h2 cursor-pointer rounded-lg px-6 py-2 font-semibold transition-colors ${
                      activeTab === 'universities'
                        ? 'bg-primary text-white'
                        : 'text-text-primary hover:bg-secondary'
                    }`}
                  >
                    University
                  </button>
                  <button
                    onClick={() => handleTabChange('consultants')}
                    className={`text-h4 md:text-h2 cursor-pointer rounded-lg px-6 py-2 font-semibold transition-colors ${
                      activeTab === 'consultants'
                        ? 'bg-primary text-white'
                        : 'text-text-primary hover:bg-secondary'
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
