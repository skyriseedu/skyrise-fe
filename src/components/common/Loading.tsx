import clsx from 'clsx';
import { motion } from 'framer-motion';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white' | 'text-primary' | 'text-secondary';
}

const Loading: React.FC<LoadingProps> = ({
  className,
  size = 'md',
  color = 'primary',
}) => {
  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const spaceClasses = {
    sm: 'space-x-1',
    md: 'space-x-2',
    lg: 'space-x-3',
  };

  const activeColorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    white: 'bg-white',
    'text-primary': 'bg-text-primary',
    'text-secondary': 'bg-text-secondary',
  };

  return (
    <motion.div
      className={clsx(
        'flex items-center justify-center',
        spaceClasses[size],
        className
      )}
    >
      {[0, 1, 2]?.map((index) => (
        <motion.div
          key={index}
          className={clsx(
            'rounded-full',
            dotSizeClasses[size],
            activeColorClasses[color]
          )}
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
};

export default Loading;
