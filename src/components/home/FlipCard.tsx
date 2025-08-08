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
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`relative w-full max-w-[400px] h-[300px] ${className}`}>
      <motion.div
        className="absolute inset-0 w-full h-full cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
        onClick={handleFlip}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <img 
                src={flipIcon} 
                alt="Flip card" 
                className="w-6 h-6"
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={icon} 
                alt={title} 
                className="w-40 h-40 object-contain"
              />
            </div>
            
            <div className="w-full py-4 px-4 flex items-center justify-center absolute bg-gray-400 mix-blend-multiply">
              <h3 className="text-h-xl lg:text-h-xl font-bold text-white tracking-wider text-center leading-tight">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="relative w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center p-8">
            <div className="absolute top-4 right-4">
              <img 
                src={flipIcon} 
                alt="Flip card" 
                className="w-6 h-6"
              />
            </div>
            
            <h3 className="text-h2 lg:text-h-xl font-bold text-text-primary mb-1">
              {title}
            </h3>
            
            {subtitle && (
              <h4 className="text-body-4 lg:text-body-1 font-semibold text-text-primary mb-2">
                {subtitle}
              </h4>
            )}
            
            <p className="text-body-4 lg:text-body-1 text-text-primary text-center mb-4">
              {description}
            </p>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick?.();
              }}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-10 rounded-[10px] transition-colors duration-200 text-body-3 lg:text-h1 w-[80%]"
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