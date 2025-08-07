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
    <div className={`relative w-80 h-96 ${className}`}>
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
          <div className="relative w-full h-full bg-white rounded-2xl flex flex-col overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <img 
                src={flipIcon} 
                alt="Flip card" 
                className="w-6 h-6"
              />
            </div>
            
            <div className="relative bg-white h-2/3 flex items-center justify-center">    
              <img 
                src={icon} 
                alt={title} 
                className="w-32 h-32 object-contain"
              />
            </div>
            
            <div className="bg-[#A6A6A6] h-1/3 flex items-center justify-center">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
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
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {title}
            </h3>
            
            {subtitle && (
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                {subtitle}
              </h4>
            )}
            
            <p className="text-gray-600 text-center mb-8">
              {description}
            </p>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick?.();
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
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