import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamCard from './TeamCard';
import type { TeamGalleryProps } from '@/types/users/about-us';

const TeamGallery: React.FC<TeamGalleryProps> = ({ members, title = "Let's meet our team" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  
  // handle mouse/touch events
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // swiped right
        setCurrentIndex(prev => prev === 0 ? members.length - 1 : prev - 1);
      } else {
        // swiped left 
        setCurrentIndex(prev => prev === members.length - 1 ? 0 : prev + 1);
      }
    }
    
    setCurrentX(0);
    setStartX(0);
  };

  // Handle wheel scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelTimeout: NodeJS.Timeout | undefined;
    let isScrolling = false;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      // scroll direction
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      
      if (Math.abs(delta) > 10) {
        isScrolling = true;
        
        if (delta > 0) {
          setCurrentIndex(prev => prev === members.length - 1 ? 0 : prev + 1);
        } else {
          setCurrentIndex(prev => prev === 0 ? members.length - 1 : prev - 1);
        }
        
        // reset scrolling flag after animation
        setTimeout(() => {
          isScrolling = false;
        }, 500);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }
    };
  }, [members.length]);

  // visible indices
  const getVisibleIndices = () => {
    const indices = [];
    const totalMembers = members.length;
    
    // show 7 cards: center + 3 on each side
    for (let i = -3; i <= 3; i++) {
      const index = (currentIndex + i + totalMembers) % totalMembers;
      indices.push({ index, offset: i });
    }
    
    return indices;
  };

  return (
    <div className="w-full py-16">
      <h2 className="text-h3 md:text-h2 lg:text-h2 font-semibold text-center text-text-primary">
        {title}
      </h2>
      
      <div className="relative max-w-[1400px] mx-auto px-8">
        {/* Cards Container */}
        <div 
          ref={containerRef} 
          className="relative h-[380px] md:h-[550px] lg:h-[550px] overflow-hidden select-none cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          <AnimatePresence mode="popLayout">
            {getVisibleIndices().map(({ index, offset }) => {
              const member = members[index];
              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);
              
              // Calculate positions and properties
              const baseX = offset * 120; // Overlapping spacing
              const dragOffset = isDragging ? (currentX - startX) * 0.2 : 0;
              const scale = isCenter ? 1.15 : 1 - (absOffset * 0.08);
              const zIndex = 30 - absOffset * 5;
              const opacity = isCenter ? 1 : Math.max(0.3, 1 - (absOffset * 0.2));
              
              return (
                <motion.div
                  key={`${currentIndex}-${offset}`}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ 
                    x: baseX - 200, 
                    scale: 0.8, 
                    opacity: 0 
                  }}
                  animate={{ 
                    x: baseX + dragOffset, 
                    scale, 
                    opacity
                  }}
                  exit={{ 
                    x: baseX + 200, 
                    scale: 0.8, 
                    opacity: 0 
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }}
                  style={{ 
                    zIndex
                  }}
                >
                  {isCenter ? (
                    <TeamCard
                      image={member.image}
                      name={member.name}
                      position={member.position}
                      department={member.department}
                      university={member.university}
                      profileLink={member.profileLink}
                    />
                  ) : (
                    <div className="pointer-events-none">
                      <TeamCard
                        image={member.image}
                        name={member.name}
                        position={member.position}
                        department={member.department}
                        university={member.university}
                        profileLink={member.profileLink}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>      
      </div>
    </div>
  );
};

export default TeamGallery;