import React from 'react';

interface KeyInfoCardProps {
  icon: string;
  label: string;
  value: string;
}

const KeyInfoCard: React.FC<KeyInfoCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-[#FCE8EC] rounded-xl p-4 lg:p-5 flex items-center gap-3 h-full">
      <span className="text-xl lg:text-2xl">{icon}</span>
      <div>
        <p className="text-gray-700 text-sm lg:text-base">{label}</p>
        <p className="text-lg lg:text-xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KeyInfoCard;