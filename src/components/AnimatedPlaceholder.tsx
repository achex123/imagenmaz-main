import React, { useState, useEffect, useRef } from 'react';

interface AnimatedPlaceholderProps {
  suggestions: string[];
  typingDelay?: number;
  pauseDelay?: number;
  deleteDelay?: number;
  darkMode?: boolean;
}

const AnimatedPlaceholder: React.FC<AnimatedPlaceholderProps> = ({ 
  suggestions,
  typingDelay = 100,
  pauseDelay = 2000,
  deleteDelay = 50,
  darkMode = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const currentSuggestion = suggestions[currentIndex];
    
    if (isTyping && !isPaused) {
      if (displayText.length < currentSuggestion.length) {
        // Type next character
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentSuggestion.substring(0, displayText.length + 1));
        }, typingDelay);
      } else {
        // Full text typed, pause before deleting
        setIsTyping(false);
        setIsPaused(true);
        timeoutRef.current = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDelay);
      }
    } else if (isDeleting && !isPaused) {
      if (displayText.length > 0) {
        // Delete a character
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, deleteDelay);
      } else {
        // Text fully deleted, move to next suggestion
        setIsDeleting(false);
        setCurrentIndex((currentIndex + 1) % suggestions.length);
        setIsTyping(true);
        // Small pause before starting new word
        setIsPaused(true);
        timeoutRef.current = setTimeout(() => {
          setIsPaused(false);
        }, 500);
      }
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, currentIndex, isTyping, isDeleting, isPaused, suggestions, typingDelay, pauseDelay, deleteDelay]);
  
  return (
    <div className="flex items-center">
      <span className={`${darkMode ? 'text-zinc-400' : 'text-gray-400'}`}>{displayText}</span>
      <span 
        className={`ml-0.5 inline-block w-0.5 h-5 ${darkMode ? 'bg-indigo-400' : 'bg-primary/70'} animate-blink`}
      ></span>
    </div>
  );
};

export default AnimatedPlaceholder;
