import { motion } from 'framer-motion';
import { useState } from 'react';
import flipIcon from '@/assets/flip-card-arrow.svg';

interface FlipCardProps {
  title: string;
  icon: string;
  description: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  title,
  icon,
  description,
  subtitle,
  buttonText = 'Check service',
  onButtonClick,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`relative h-[300px] w-full max-w-[400px] ${className}`}>
      <motion.div
        className="absolute inset-0 h-full w-full cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
        onClick={handleFlip}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 h-full w-full rounded-3xl shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white">
            <div className="absolute top-4 right-4 z-10">
              <img src={flipIcon} alt="Flip card" className="h-6 w-6" />
            </div>

            <div className="flex flex-1 items-center justify-center p-8">
              <img
                src={icon}
                alt={title}
                className="h-32 w-32 object-contain"
              />
            </div>

            <div className="flex items-center justify-center bg-secondary px-4 py-6">
              <h3 className="text-h2 lg:text-h-xl text-center font-semibold text-primary">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 h-full w-full rounded-3xl shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="relative flex h-full w-full flex-col items-center justify-center rounded-3xl bg-white p-8">
            <div className="absolute top-4 right-4">
              <img src={flipIcon} alt="Flip card" className="h-6 w-6" />
            </div>

            <h3 className="text-h2 lg:text-h-xl text-text-primary mb-1 font-bold">
              {title}
            </h3>

            {subtitle && (
              <h4 className="text-body-4 lg:text-body-1 text-text-primary mb-2 font-semibold">
                {subtitle}
              </h4>
            )}

            <p className="text-body-4 lg:text-body-1 text-text-primary mb-4 text-center">
              {description}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick?.();
              }}
              className="bg-primary hover:bg-primary/90 text-body-3 lg:text-h1 w-[80%] rounded-[10px] px-10 py-3 font-medium text-white transition-colors duration-200"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;
