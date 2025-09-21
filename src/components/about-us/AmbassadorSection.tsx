import React, { useRef, useState, useEffect } from 'react';
import AmbassadorCard from './AmbassadorCard';
import type {
  Ambassador,
  AmbassadorSectionProps,
} from '@/types/users/about-us';
import { useAmbassadors } from '@/queries';

import type { AmbassadorApiItem } from '@/types/users/ambassadors';

const AmbassadorSection: React.FC<AmbassadorSectionProps> = ({
  title = 'Student Ambassadors',
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState({ width: 30, left: 0 });
  const {
    data: ambassadorsResponse,
    isPending: isAmbassadorsLoading,
    isError: isAmbassadorsError,
  } = useAmbassadors(1, 20);

  const apiAmbassadors = React.useMemo(
    () => ambassadorsResponse?.data?.ambassadors ?? [],
    [ambassadorsResponse]
  );

  const ambassadors: Ambassador[] = React.useMemo(() => {
    if (!apiAmbassadors.length) {
      return [];
    }

    return apiAmbassadors.map(
      (ambassador: AmbassadorApiItem) =>
        ({
          id: ambassador.id ?? ambassador._id,
          image: ambassador.profileImage,
          name: ambassador.ambassadorName,
          department: ambassador.major,
          university: ambassador.university,
        }) satisfies Ambassador
    );
  }, [apiAmbassadors]);

  const hasAmbassadors = ambassadors.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollWidth = container.scrollWidth - container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const scrollPercentage =
        scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;

      const indicatorWidth = 30;
      const maxLeft = 100 - indicatorWidth;
      const left = (scrollPercentage / 100) * maxLeft;

      setScrollProgress({ width: indicatorWidth, left });
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);

    // Initial calculation
    handleScroll();

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [ambassadors.length]);

  return (
    <section className={`w-full px-2 py-12 lg:py-20 ${className}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-h3 md:text-h2 lg:text-h2 text-text-primary mb-8 text-left font-semibold">
          {title}
        </h2>
      </div>

      <div className="mx-auto max-w-[1200px]">
        {isAmbassadorsLoading && (
          <p className="text-center text-sm text-neutral-500">
            Loading ambassadors...
          </p>
        )}

        {isAmbassadorsError && !isAmbassadorsLoading && (
          <p className="text-center text-sm text-red-500">
            We could not load ambassadors at the moment. Please try again later.
          </p>
        )}

        {!isAmbassadorsLoading && !isAmbassadorsError && !hasAmbassadors && (
          <p className="text-center text-sm text-neutral-500">
            Ambassador information will be available soon.
          </p>
        )}

        {hasAmbassadors && (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="scrollbar-hide overflow-x-auto"
            >
              <div className="flex gap-3 px-8">
                {ambassadors.map((data) => (
                  <AmbassadorCard
                    key={data.id}
                    image={data.image}
                    name={data.name}
                    department={data.department}
                    university={data.university}
                  />
                ))}
              </div>
            </div>

            {/* custom scrollbar indicator - desktop */}
            <div className="mt-6 hidden px-90 lg:block">
              <div className="bg-secondary relative h-1.5 rounded-full">
                <div
                  className="bg-primary absolute h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${scrollProgress.width}%`,
                    left: `${scrollProgress.left}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AmbassadorSection;
