import React from 'react';

interface KeyInfoCardProps {
  icon: string;
  label: string;
  value: string;
}

const KeyInfoCard: React.FC<KeyInfoCardProps> = ({ icon, label, value }) => {
  return (
    <div className="flex h-full items-center gap-3 rounded-xl bg-[#FCE8EC] p-4 lg:p-5">
      <img src={icon} alt={label} className="-mt-7 h-6 w-6 lg:h-6 lg:w-6" />
      <div>
        <p className="text-text-primary text-body-4 lg:text-body-4">{label}</p>
        <p className="text-body-1 lg:text-body-1 text-text-primary font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KeyInfoCard;
