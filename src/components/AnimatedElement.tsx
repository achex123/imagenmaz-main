import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  animation?: 'fadeIn' | 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'pulse';
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  animation = 'fadeUp'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [delay]);
  
  const getAnimationProps = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration, ease: [0.22, 1, 0.36, 1] }
        };
      case 'fadeUp':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration, ease: [0.22, 1, 0.36, 1] }
        };
      case 'fadeDown':
        return {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration, ease: [0.22, 1, 0.36, 1] }
        };
      case 'fadeLeft':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration, ease: [0.22, 1, 0.36, 1] }
        };
      case 'fadeRight':
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration, ease: [0.22, 1, 0.36, 1] }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration, ease: [0.22, 1, 0.36, 1] }
        };
      case 'pulse':
        return {
          initial: { opacity: 1, scale: 1 },
          animate: { 
            opacity: [1, 0.8, 1], 
            scale: [1, 1.05, 1] 
          },
          transition: { 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration, ease: [0.22, 1, 0.36, 1] }
        };
    }
  };
  
  const animationProps = getAnimationProps();
  
  return (
    <motion.div
      className={className}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement;
