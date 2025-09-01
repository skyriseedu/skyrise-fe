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
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`sticky top-[77px] z-40 border-b border-gray-200 bg-white will-change-transform ${className}`}
    >
      <div className={`${mobilePadding} ${desktopPadding} py-4`}>
        <div className="lg:mx-auto lg:max-w-7xl">
          <div className="flex items-start gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="mt-1 cursor-pointer lg:mt-0"
              >
                <img
                  src={arrowLeft}
                  alt="Back"
                  className="h-5 w-5 lg:h-6 lg:w-6"
                />
              </button>
            )}
            <div className="flex-1">
              {title && (
                <h1 className="text-text-primary text-h2 leading-tight font-semibold lg:text-h2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-text-secondary mt-2 text-sm">{subtitle}</p>
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
