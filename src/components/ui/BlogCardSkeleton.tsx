import React from 'react';

interface BlogCardSkeletonProps {
  variant?: 'medium' | 'small' | 'mini';
  className?: string;
}

const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({
  variant = 'medium',
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'medium':
        return {
          container: 'max-w-full',
          imageHeight: 'h-26 lg:h-50',
          padding: 'p-6',
        };
      case 'small':
        return {
          container: 'w-50 lg:w-62 lg:h-80 h-70',
          imageHeight: 'aspect-video',
          padding: 'p-4',
        };
      case 'mini':
        return {
          container: 'w-full h-18 lg:h-20',
          imageHeight: 'w-20 h-15 lg:h-20',
          padding: 'p-4',
        };
      default:
        return {
          container: 'max-w-4xl',
          imageHeight: 'h-26',
          padding: 'p-6',
        };
    }
  };

  const variantClasses = getVariantClasses();

  if (variant === 'mini') {
    return (
      <div
        className={`flex items-center gap-4 overflow-hidden rounded-lg bg-white shadow-lg ${variantClasses.container} ${className}`}
      >
        {/* Image skeleton */}
        <div
          className={`${variantClasses.imageHeight} flex-shrink-0 overflow-hidden rounded-lg py-2 pl-2`}
        >
          <div className="bg-secondary h-full w-full animate-pulse rounded-lg"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 py-1">
          {/* Title skeleton */}
          <div className="mb-2 space-y-2">
            <div className="bg-secondary h-4 w-full animate-pulse rounded"></div>
            <div className="bg-secondary h-4 w-3/4 animate-pulse rounded"></div>
          </div>

          {/* Date skeleton */}
          <div className="bg-secondary h-3 w-1/2 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`block overflow-hidden rounded-lg bg-white shadow-md ${variantClasses.container} ${className}`}
    >
      {/* Image skeleton */}
      <div
        className={`${variantClasses.imageHeight} overflow-hidden ${variant === 'medium' || variant === 'small' ? 'px-2 pt-3 lg:px-3' : ''}`}
      >
        <div
          className={`bg-secondary h-full w-full animate-pulse ${variant === 'medium' || variant === 'small' ? 'rounded-lg' : ''}`}
        ></div>
      </div>

      {/* Content skeleton */}
      <div className={variantClasses.padding}>
        {/* Title skeleton */}
        <div className="mb-2 space-y-2">
          <div className="bg-secondary h-5 w-full animate-pulse rounded"></div>
          <div className="bg-secondary h-5 w-4/5 animate-pulse rounded"></div>
        </div>

        {/* Date skeleton */}
        <div className="bg-secondary mb-4 h-3 w-1/3 animate-pulse rounded"></div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="bg-secondary h-4 w-full animate-pulse rounded"></div>
          <div className="bg-secondary h-4 w-full animate-pulse rounded"></div>
          <div className="bg-secondary h-4 w-2/3 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
