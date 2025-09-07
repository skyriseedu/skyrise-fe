import React from 'react';

interface KeyInfoCardProps {
  label: string;
  value: string;
}

const KeyInfoCard: React.FC<KeyInfoCardProps> = ({ label, value }) => {
  return (
    <div className="flex h-full items-center gap-2 rounded-xl bg-[#FCE8EC] p-3 sm:gap-3 sm:p-4 lg:p-5">
      <div className="min-w-0">
        <p className="text-text-primary text-body-5 sm:text-body-4 lg:text-body-4">
          {label}
        </p>
        <p className="text-body-3 sm:text-body-2 lg:text-body-1 text-text-primary font-semibold break-words">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KeyInfoCard;
