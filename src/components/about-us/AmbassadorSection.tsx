import React, { useRef, useState, useEffect } from 'react';
import AmbassadorCard from './AmbassadorCard';
import type {
  Ambassador,
  AmbassadorSectionProps,
} from '@/types/users/about-us';

const AmbassadorSection: React.FC<AmbassadorSectionProps> = ({
  title = 'Student Ambassadors',
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState({ width: 30, left: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollWidth = container.scrollWidth - container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const scrollPercentage = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
      
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
  }, []);

  const list: Ambassador[] = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
    {
      id: 7,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      name: 'Kay Thwe San',
      department: 'International Business',
      university: 'Rangsit University',
    },
  ];

  return (
    <section className={`w-full px-6 py-12 lg:py-16 ${className}`}>
      <h2 className="text-h3 px-4 lg:px-22 md:text-h2 lg:text-h2 text-text-primary mb-8 text-start font-semibold">
        {title}
      </h2>

      <div className="mx-auto max-w-[1200px]">
        <div className="relative">
          <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-8">
              {list?.map((data) => (
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
          <div className="hidden lg:block mt-6 px-70">
            <div className="relative h-1.5 bg-secondary rounded-full">
              <div 
                className="absolute h-full bg-primary rounded-full transition-all duration-300"
                style={{ 
                  width: `${scrollProgress.width}%`, 
                  left: `${scrollProgress.left}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmbassadorSection;
