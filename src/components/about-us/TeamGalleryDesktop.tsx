import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CaretLeft from "@/assets/Variant3Left.svg?react";
import CaretRight from "@/assets/Variant3.svg?react";
import clsx from "clsx";
import TeamCard from "./TeamCard";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  university: string;
  image: string;
  profileLink?: string;
}

interface TeamGalleryProps {
  members: TeamMember[];
  title?: string;
}

const TeamGalleryDesktop: React.FC<TeamGalleryProps> = ({members}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, members?.length - itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleMembers = members?.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className="w-full py-16 px-4">
      <h2 className="text-h2 text-center mb-12 text-text-primary">
        Let's meet Our Team
      </h2>

      <div className="relative max-w-6xl mx-auto">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={clsx(
            "absolute -left-16 top-1/2 -translate-y-1/2 z-10",
            "w-10 h-10",
            "flex items-center justify-center",
            "transition-opacity duration-300",
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"
          )}
        >
          <CaretLeft />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          className={clsx(
            "absolute -right-16 top-1/2 -translate-y-1/2 z-10",
            "w-10 h-10",
            "flex items-center justify-center",
            "transition-opacity duration-300",
            currentIndex === maxIndex ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"
          )}
        >
          <CaretRight/>
        </button>

        <div className="overflow-hidden px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center gap-3"
            >
              {visibleMembers?.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0"
                >
                  <TeamCard 
                    image={member.image}
                    name={member.name}
                    position={member.position}
                    department={member.department}
                    university={member.university}
                    profileLink={member.profileLink}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TeamGalleryDesktop;
