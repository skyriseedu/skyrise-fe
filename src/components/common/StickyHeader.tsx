import React from 'react';
import { useNavigate } from 'react-router-dom';
import arrowLeft from '@/assets/arrow-left.svg';

interface StickyHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  mobilePadding?: string;
  desktopPadding?: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ 
  title, 
  subtitle, 
  className = '', 
  mobilePadding = 'px-4',
  desktopPadding = 'px-4',
  showBackButton = true,
  children
}) => {
  const navigate = useNavigate();

  return (
    <div className={`sticky top-[77px] bg-white z-40 border-b border-gray-200 will-change-transform ${className}`}>
      <div className={`${mobilePadding} ${desktopPadding} py-4`}>
        <div className="lg:max-w-7xl lg:mx-auto">
          <div className="flex items-start gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="mt-1 lg:mt-0"
              >
                <img src={arrowLeft} alt="Back" className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            )}
            <div className="flex-1">
              {title && (
                <h1 className="text-xl lg:text-2xl font-semibold text-text-primary leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-text-secondary text-sm mt-2 lg:hidden">{subtitle}</p>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyHeader;