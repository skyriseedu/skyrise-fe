import { useState } from 'react';
import { motion } from 'framer-motion';
import CaretLeft from '@/assets/Variant3Left.svg?react';
import CaretRight from '@/assets/Variant3.svg?react';
import clsx from 'clsx';
import TeamCard from './TeamCard';
import type { TeamGalleryProps } from '@/types/users/about-us';

const TeamGalleryDesktop: React.FC<TeamGalleryProps> = ({
  members,
  title = "Let's meet our team",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, members?.length - itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-h2 text-text-primary mb-12 text-center font-semibold">
          {title}
        </h2>

        <div className="relative mx-auto max-w-6xl">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={clsx(
              'absolute top-1/2 -left-8 z-10 -translate-y-1/2 lg:-left-16',
              'h-10 w-10',
              'flex items-center justify-center',
              'transition-opacity duration-300',
              currentIndex === 0
                ? 'cursor-not-allowed opacity-50'
                : 'hover:cursor-pointer'
            )}
          >
            <CaretLeft />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className={clsx(
              'absolute top-1/2 -right-8 z-10 -translate-y-1/2 lg:-right-16',
              'h-10 w-10',
              'flex items-center justify-center',
              'transition-opacity duration-300',
              currentIndex === maxIndex
                ? 'cursor-not-allowed opacity-50'
                : 'hover:cursor-pointer'
            )}
          >
            <CaretRight />
          </button>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-3"
              animate={{ x: -currentIndex * (280 + 12) }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 30,
              }}
            >
              {members?.map((member) => (
                <div key={member.id} className="flex-shrink-0">
                  <TeamCard
                    image={member.image}
                    name={member.name}
                    position={member.position}
                    department={member.department}
                    university={member.university}
                    profileLink={member.profileLink}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamGalleryDesktop;
