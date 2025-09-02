import React from 'react';
import openLinkIcon from '@/assets/open-link.svg';

interface TeamCardProps {
  image: string;
  name: string;
  position: string;
  department: string;
  university: string;
  profileLink?: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  image,
  name,
  position,
  department,
  university,
  profileLink
}) => {
  return (
    <div className="bg-white rounded-2xl border-1 border-gray-100 shadow-md overflow-hidden w-[214px] h-[268px] md:w-[280px] md:h-[350px] lg:w-[280px] lg:h-[380px] flex flex-col">
      <div className="relative p-3 md:p-4 lg:p-5 pb-0">
        <div className="rounded-xl overflow-hidden border-2 md:border-3 lg:border-4 border-red-500">
          <img
            src={image}
            alt={name}
            className="w-full h-[120px] md:h-[160px] lg:h-[180px] object-cover"
          />
        </div>
      </div>
      
      <div className="px-4 md:px-5 lg:px-6 pt-2 md:pt-0 lg:pt-0 pb-3 flex flex-col">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <h3 className="text-h3 lg:text-h3 font-semibold text-text-primary mt-2">
            {name}
          </h3>
          {profileLink && (
            <a
              href={openLinkIcon}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white cursor-pointer transition-colors rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ml-2"
            >
              <img src={openLinkIcon} alt="Open profile" className="w-6 h-6"  />
            </a>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1 md:space-y-2 text-body-6 md:text-body-4 lg:text-body-6">
            <p className="text-text-primary font-semibold">
              {position}
            </p>
            
            <p className="text-text-primary text-body-4 md:text-body-4 lg:text-body-4">
              {department}
            </p>
            
            <p className="text-text-primary text-body-4 md:text-body-4 lg:text-body-4">
              {university}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;