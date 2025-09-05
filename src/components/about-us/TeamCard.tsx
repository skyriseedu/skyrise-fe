import React from 'react';
import openLinkIcon from '@/assets/open-link.svg';
import type { TeamCardProps } from '@/types/users/about-us';

const TeamCard: React.FC<TeamCardProps> = ({
  image,
  name,
  position,
  department,
  university,
  profileLink,
}) => {
  return (
    <div className="flex h-[268px] w-[214px] flex-col overflow-hidden rounded-2xl border-1 border-gray-100 bg-white shadow-md md:h-[350px] md:w-[280px] lg:h-[380px] lg:w-[280px]">
      <div className="relative p-3 pb-0 md:p-4 lg:p-5">
        <div className="overflow-hidden rounded-xl ">
          <img
            src={image}
            alt={name}
            className="h-[120px] w-full object-cover md:h-[160px] lg:h-[180px]"
          />
        </div>
      </div>

      <div className="flex flex-col px-4 pt-2 pb-3 md:px-5 md:pt-0 lg:px-6 lg:pt-0">
        <div className="mb-2 flex items-center justify-between md:mb-3">
          <h3 className="text-h3 lg:text-h3 text-text-primary mt-2 font-semibold">
            {name}
          </h3>
          {profileLink && (
            <a
              href={profileLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white transition-colors md:rounded-xl"
              aria-label={`View ${name}'s profile`}
            >
              <img src={openLinkIcon} alt="Open profile" className="h-6 w-6" />
            </a>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div className="text-body-6 md:text-body-4 lg:text-body-6 space-y-1 md:space-y-2">
            <p className="text-text-primary font-semibold">{position}</p>

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
