import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { enhancePrompt } from '@/lib/enhancePrompt';
import AnimatedPlaceholder from './AnimatedPlaceholder';
import { toast } from 'sonner';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isLoading = false,
  defaultValue = '',
  className,
  disabled = false
}) => {
  const [prompt, setPrompt] = useState(defaultValue);
  const [isEnhancing, setIsEnhancing] = useState(false);
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
    if (prompt.trim() && !isLoading && !disabled && !isEnhancing) {
      onSubmit(prompt.trim());
    }
  };

  // Function to enhance the prompt using Gemini 1.5 Flash
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing || isLoading || disabled) return;
    
    try {
      setIsEnhancing(true);
      const enhancedPrompt = await enhancePrompt(prompt);
      
      // Apply the enhanced prompt
      setPrompt(enhancedPrompt);
      
      // Show success message with clearer explanation
      toast.success('Prompt enhanced', {
        description: 'Your edit description has been refined for better results',
      });
    } catch (error) {
      // Handle specific API key missing error
      if ((error as Error).name === 'ApiKeyMissingError') {
        toast.error('API key missing', {
          description: 'Please add your Gemini API key to the .env file'
        });
      } else {
        // Handle generic errors
        toast.error('Failed to enhance prompt', {
          description: 'Please try again or continue with your original prompt'
        });
      }
      console.error('Enhance prompt error:', error);
    } finally {
      setIsEnhancing(false);
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
          disabled={isLoading || disabled || isEnhancing}
          rows={1}
          className={cn(
            'w-full p-4 pr-24 text-sm sm:text-base resize-none overflow-hidden rounded-lg font-sans',
            'bg-white border border-input/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
            'shadow-sm transition-all duration-200 outline-none',
            'placeholder:text-muted-foreground',
            (isLoading || disabled || isEnhancing) && 'opacity-70 cursor-not-allowed'
          )}
        />
        
        {/* Animated placeholder that shows when empty */}
        {!prompt && (
          <div className="absolute left-4 top-4 pointer-events-none font-sans text-sm sm:text-base text-gray-400">
            <AnimatedPlaceholder suggestions={suggestions} />
          </div>
        )}
        
        {/* Enhance button with improved styling */}
        {prompt.trim().length > 0 && (
          <button
            type="button"
            onClick={handleEnhancePrompt}
            disabled={isLoading || disabled || isEnhancing || !prompt.trim()}
            className={cn(
              'absolute right-12 top-2 p-2 rounded-md',
              'transition-all duration-200 group',
              isEnhancing ? 'bg-indigo-100 text-indigo-600 shadow-sm' :
                prompt.trim() && !isLoading && !disabled
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
            title="Refine your edit description"
          >
            {isEnhancing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="absolute -top-10 right-0 bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border border-indigo-100">
                  Refine Edit
                </span>
              </>
            )}
          </button>
        )}
        
        {/* Submit button with improved styling */}
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading || disabled || isEnhancing}
          className={cn(
            'absolute right-2 top-2 p-2 rounded-md',
            'transition-all duration-200',
            prompt.trim() && !isLoading && !disabled && !isEnhancing
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-600 active:shadow-inner'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
