import React from 'react';

interface KeyInfoCardProps {
  icon: string;
  label: string;
  value: string;
}

const KeyInfoCard: React.FC<KeyInfoCardProps> = ({ icon, label, value }) => {
  
  return (
    <div className="bg-[#FCE8EC] rounded-xl p-4 lg:p-5 flex items-center gap-3 h-full">
        <img 
          src={icon} 
          alt={label} 
          className="w-6 h-6 lg:w-6 -mt-7 lg:h-6"
        />
      <div>
        <p className="text-text-primary text-body-4 lg:text-body-4">{label}</p>
        <p className="text-body-1 lg:text-h3 font-semibold text-text-primary">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KeyInfoCard;