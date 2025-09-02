import { useState } from "react";
import { motion } from "framer-motion";
import CaretLeft from "@/assets/Variant3Left.svg?react";
import CaretRight from "@/assets/Variant3.svg?react";
import clsx from "clsx";
import TeamCard from "./TeamCard";
import type { TeamGalleryProps } from "@/types/users/about-us";

const TeamGalleryDesktop: React.FC<TeamGalleryProps> = ({ members, title = "Let's meet our team" }) => {
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
    <div className="w-full py-16 px-4">
      <h2 className="text-h2 text-center mb-12 text-text-primary">
        {title}
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

        <div className="px-8 overflow-hidden">
          <motion.div
            className="flex gap-3"
            animate={{ x: -currentIndex * (280 + 12) }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 30
            }}
          >
            {members?.map((member) => (
              <div
                key={member.id}
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
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TeamGalleryDesktop;
