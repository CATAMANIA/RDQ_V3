import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimatedGridProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  children,
  className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6",
  staggerDelay = 0.05
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {children.map((child, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3, 
              delay: index * staggerDelay,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="h-full"
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};