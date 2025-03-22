import React, { useState, useEffect, useRef } from 'react';
import { Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedPlaceholder from './AnimatedPlaceholder';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  defaultValue?: string;
  className?: string;
  disabled?: boolean; // Add the disabled prop to the interface
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isLoading = false,
  defaultValue = '',
  className,
  disabled = false // Set default value to false
}) => {
  const [prompt, setPrompt] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Example suggestions for the placeholder
  const suggestions = [
    "Turn this photo into a watercolor painting",
    "Make the background blurry",
    "Change the sky to a sunset",
    "Make it look like a professional portrait",
    "Give it a cinematic color grade",
    "Apply a vintage film effect",
    "Remove the background completely"
  ];
  
  // Auto resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder=" "
          disabled={isLoading || disabled}
          rows={1}
          className={cn(
            'w-full p-4 pr-12 text-sm sm:text-base resize-none overflow-hidden rounded-lg font-hand',
            'bg-white border border-input focus:ring-2 focus:ring-ring focus:border-input',
            'transition-all duration-200 outline-none',
            'placeholder:text-muted-foreground',
            (isLoading || disabled) && 'opacity-70 cursor-not-allowed'
          )}
        />
        
        {/* Animated placeholder that shows when empty */}
        {!prompt && (
          <div className="absolute left-4 top-4 pointer-events-none font-hand text-sm sm:text-base">
            <AnimatedPlaceholder suggestions={suggestions} />
          </div>
        )}
        
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading || disabled}
          className={cn(
            'absolute right-2 top-2 p-2 rounded-md',
            'transition-all duration-200',
            prompt.trim() && !isLoading && !disabled
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          <Wand2 className={cn(
            'w-5 h-5',
            isLoading && 'animate-pulse'
          )} />
        </button>
      </div>
    </form>
  );
};

export default PromptInput;
