import React, { useRef, useState, useEffect, useCallback } from 'react';
import AmbassadorCard from './AmbassadorCard';
import type {
  Ambassador,
  AmbassadorSectionProps,
} from '@/types/users/about-us';
import { useConsultants } from '@/queries/consultants';
import type { Consultant } from '@/types/users/consultant';

const MIN_INDICATOR_WIDTH = 15;

const AmbassadorSection: React.FC<AmbassadorSectionProps> = ({
  title = 'Student Ambassadors',
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState({ width: 30, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const {
    data: consultantsResponse,
    isPending: isConsultantsLoading,
    isError: isConsultantsError,
  } = useConsultants(1, 20);

  const apiConsultants = React.useMemo(
    () => consultantsResponse?.data?.consultants ?? [],
    [consultantsResponse]
  );

  const ambassadors: Ambassador[] = React.useMemo(() => {
    if (!apiConsultants.length) {
      return [];
    }

    return apiConsultants.map(
      (consultant: Consultant) =>
        ({
          id: consultant.id ?? consultant._id ?? consultant.slug ?? '',
          image: consultant.profileImage ?? '',
          name: consultant.consultantName ?? consultant.name ?? '',
          department: consultant.major ?? consultant.specialization?.[0] ?? '',
          university: consultant.university ?? consultant.company ?? '',
        }) satisfies Ambassador
    );
  }, [apiConsultants]);

  const hasAmbassadors = ambassadors.length > 0;

  const updateIndicatorState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;
    const scrollLeft = container.scrollLeft;

    const rawIndicatorWidth =
      scrollWidth > 0 ? (clientWidth / scrollWidth) * 100 : 100;
    const indicatorWidth = Math.min(
      100,
      Math.max(rawIndicatorWidth, MIN_INDICATOR_WIDTH)
    );
    const maxLeft = Math.max(100 - indicatorWidth, 0);
    const left = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * maxLeft : 0;

    setScrollProgress({ width: indicatorWidth, left });
  }, []);

  const updateScrollFromPointer = useCallback(
    (clientX: number, shouldSmooth = false) => {
      const container = scrollContainerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const trackRect = track.getBoundingClientRect();
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) {
        return;
      }

      const indicatorWidthPercent = Math.min(
        100,
        Math.max((container.clientWidth / container.scrollWidth) * 100, MIN_INDICATOR_WIDTH)
      );
      const indicatorWidthPx = (indicatorWidthPercent / 100) * trackRect.width;
      const maxIndicatorLeftPx = Math.max(trackRect.width - indicatorWidthPx, 0);

      const desiredLeft = clientX - trackRect.left - dragOffsetRef.current;
      const clampedIndicatorLeft = Math.min(
        Math.max(desiredLeft, 0),
        maxIndicatorLeftPx
      );
      const scrollRatio =
        maxIndicatorLeftPx > 0 ? clampedIndicatorLeft / maxIndicatorLeftPx : 0;
      const newScrollLeft = scrollRatio * maxScrollLeft;

      container.scrollTo({
        left: newScrollLeft,
        behavior: shouldSmooth ? 'smooth' : 'auto',
      });
    },
    []
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isDragging) return;
      updateIndicatorState();
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isDragging, updateIndicatorState, ambassadors.length]);

  useEffect(() => {
    const handleResize = () => updateIndicatorState();

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicatorState]);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      updateScrollFromPointer(event.clientX);
    };

    const handlePointerUp = () => setIsDragging(false);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, updateScrollFromPointer]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const indicator = indicatorRef.current;
      if (!indicator) return;

      const indicatorRect = indicator.getBoundingClientRect();
      const clickedInsideIndicator =
        event.clientX >= indicatorRect.left && event.clientX <= indicatorRect.right;

      dragOffsetRef.current = clickedInsideIndicator
        ? event.clientX - indicatorRect.left
        : indicatorRect.width / 2;

      if (!clickedInsideIndicator) {
        updateScrollFromPointer(event.clientX, true);
        return;
      }

      updateScrollFromPointer(event.clientX);
      setIsDragging(true);
    },
    [updateScrollFromPointer]
  );

  return (
    <section className={`w-full px-2 py-12 lg:py-20 ${className}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-h3 md:text-h2 lg:text-h2 text-text-primary mb-8 text-left font-semibold">
          {title}
        </h2>
      </div>

      <div className="mx-auto max-w-[1200px]">
        {isConsultantsLoading && (
          <p className="text-center text-sm text-neutral-500">
            Loading ambassadors...
          </p>
        )}

        {isConsultantsError && !isConsultantsLoading && (
          <p className="text-center text-sm text-red-500">
            We could not load ambassadors at the moment. Please try again later.
          </p>
        )}

        {!isConsultantsLoading && !isConsultantsError && !hasAmbassadors && (
          <p className="text-center text-sm text-neutral-500">
            Ambassador information will be available soon.
          </p>
        )}

        {hasAmbassadors && (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="scrollbar-hide overflow-x-auto scroll-smooth"
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
              <div
                ref={trackRef}
                onPointerDown={handlePointerDown}
                className="bg-secondary relative h-1.5 rounded-full cursor-pointer touch-none"
                role="scrollbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={scrollProgress.left}
              >
                <div
                  ref={indicatorRef}
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
