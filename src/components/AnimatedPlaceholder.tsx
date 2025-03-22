
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPlaceholderProps {
  suggestions: string[];
  className?: string;
}

const AnimatedPlaceholder: React.FC<AnimatedPlaceholderProps> = ({ 
  suggestions,
  className
}) => {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
        setIsFading(false);
      }, 500);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [suggestions.length]);
  
  return (
    <span 
      className={cn(
        'text-muted-foreground transition-opacity duration-500',
        isFading ? 'opacity-0' : 'opacity-100',
        className
      )}
    >
      {suggestions[currentSuggestion]}
    </span>
  );
};

export default AnimatedPlaceholder;
