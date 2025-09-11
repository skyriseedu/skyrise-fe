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
  isLoading?: boolean;
  useContainer?: boolean;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  title,
  subtitle,
  className = '',
  mobilePadding = 'px-4',
  desktopPadding = 'px-4',
  showBackButton = true,
  children,
  isLoading = false,
  useContainer = true,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`sticky top-[77px] z-40 border-b border-gray-200 bg-white will-change-transform ${className}`}
    >
      <div className={`${mobilePadding} ${desktopPadding} py-4`}>
        <div className={useContainer ? 'lg:mx-auto lg:max-w-7xl' : ''}>
          <div className="flex items-start gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="mt-1 cursor-pointer lg:mt-1"
              >
                <img
                  src={arrowLeft}
                  alt="Back"
                  className="h-5 w-5 lg:h-6 lg:w-6"
                />
              </button>
            )}
            <div className="flex-1">
              {isLoading ? (
                <>
                  <div className="animate-pulse">
                    <div className="bg-secondary mb-3 h-20 w-3/4 rounded"></div>
                    <div className="bg-secondary h-6 w-1/3 rounded"></div>
                  </div>
                </>
              ) : (
                <>
                  {title && (
                    <h1 className="text-text-primary text-h2 lg:text-h2 font-semibold">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-text-secondary mt-2 text-sm">
                      {subtitle}
                    </p>
                  )}
                </>
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
