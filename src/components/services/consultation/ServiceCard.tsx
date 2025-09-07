import React from 'react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  icon: string;
  iconAlt?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
}

const baseCardClasses =
  'rounded-3xl bg-white shadow-md hover:shadow-lg transition-shadow px-6 py-8 flex flex-col items-center justify-center text-center cursor-pointer w-[207px] h-[147px] md:w-full md:max-w-[406px] md:h-[255px]';

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  icon,
  iconAlt,
  to,
  onClick,
  className = '',
  iconClassName = 'h-16 w-16 md:h-20 md:w-20',
}) => {
  const content = (
    <div className={`${baseCardClasses} ${className}`}>
      <img
        src={icon}
        alt={iconAlt || title}
        className={`${iconClassName} mb-4 object-contain`}
      />
      <h3 className="text-h4 lg:text-h3 text-text-primary font-semibold">
        {title}
      </h3>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="focus-visible:ring-primary block cursor-pointer rounded-3xl focus:outline-none focus-visible:ring-2"
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="focus-visible:ring-primary block w-full rounded-3xl text-left focus:outline-none focus-visible:ring-2"
      >
        {content}
      </button>
    );
  }

  return <div className="block">{content}</div>;
};

export default ServiceCard;
