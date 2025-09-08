import React from 'react';

interface KeyInfoCardProps {
  label: string;
  value: string;
}

const KeyInfoCard: React.FC<KeyInfoCardProps> = ({ label, value }) => {
  return (
    <div className="flex h-full flex-col items-start justify-around gap-2 rounded-xl bg-[#FCE8EC] p-3 shadow-xl sm:gap-3 sm:p-4 lg:p-5">
      <p className="text-text-primary lg:text-h-3 text-h-5 lg:text-body-4">
        {label}
      </p>
      <p className="lg:text-body-1 text-body-1 lg:text-body-1 text-text-primary font-semibold break-words">
        {value}
      </p>
    </div>
  );
};

export default KeyInfoCard;
