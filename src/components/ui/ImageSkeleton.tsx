import React from 'react';

interface ImageSkeletonProps {
  className?: string;
}

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({ className = '' }) => {
  return <div className={`bg-secondary ${className}`}></div>;
};

export default ImageSkeleton;
