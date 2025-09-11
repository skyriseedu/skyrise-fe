import type { UniversityLogo } from '@/types/users/university-logos';
import React from 'react';

interface UniversityListProps {
  logos?: UniversityLogo[];
}

const UniversityList: React.FC<UniversityListProps> = ({ logos }) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setIsPaused(true);
    // Resume animation after 3 seconds of no scrolling
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="scrollbar-hide cursor-grab overflow-x-auto active:cursor-grabbing"
        onScroll={handleScroll}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
      >
        <div
          className={`flex gap-4 ${!isPaused ? 'animate-scroll-logos' : ''}`}
        >
          {[...Array(3)]?.map((_, setIndex) => (
            <React.Fragment key={setIndex}>
              {logos &&
                logos.map((logo, index) => (
                  <div key={`${index}-${setIndex}`} className="flex-shrink-0">
                    <img
                      src={logo.logoUrl}
                      alt={logo.universityName}
                      className="w-35 object-contain lg:w-54"
                    />
                  </div>
                ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversityList;
