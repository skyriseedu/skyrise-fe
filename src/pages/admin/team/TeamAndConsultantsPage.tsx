import React from 'react';
import clsx from 'clsx';

import SkyRiseTeamTab from './SkyRiseTeamTab';
import ConsultantsTab from './ConsultantsTab';

type TeamTab = 'team' | 'consultants';

const tabs: Array<{ key: TeamTab; label: string }> = [
  { key: 'team', label: 'SKYRISE Team' },
  { key: 'consultants', label: 'Consultants' },
];

const TeamAndConsultantsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TeamTab>('team');

  return (
    <div className="space-y-8 text-gray-700">
      <section className="space-y-6 mt-6">
        <div className="flex flex-wrap items-center gap-6 pb-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  "text-h4 relative cursor-pointer pb-3 font-semibold text-gray-500 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-full after:transition-colors after:duration-200 after:content-['']",
                  isActive
                    ? 'text-primary after:bg-primary'
                    : 'hover:text-primary after:bg-transparent'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === 'team' ? <SkyRiseTeamTab /> : <ConsultantsTab />}
        </div>
      </section>
    </div>
  );
};

export default TeamAndConsultantsPage;
