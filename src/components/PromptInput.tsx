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
  originalImage?: string;
  isEditing?: boolean;
  darkMode?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isLoading = false,
  defaultValue = '',
  className,
  disabled = false,
  originalImage,
  isEditing = true, // Default to editing mode as that's the main use case
  darkMode = false
}) => {
  // Initialize with defaultValue
  const [prompt, setPrompt] = useState(defaultValue);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update prompt when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setPrompt(defaultValue);
      // Auto resize when default value is set
      if (textareaRef.current) {
        autoResizeTextarea(textareaRef.current);
      }
    }
  }, [defaultValue]);

  // Auto resize the textarea based on content and scroll to bottom
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    // Reset height to auto to get proper scrollHeight
    element.style.height = 'auto';
    // Set to scrollHeight to expand the textarea
    element.style.height = `${element.scrollHeight}px`;
    // Ensure it doesn't get too tall
    const maxHeight = 300; // max height in pixels
    if (element.scrollHeight > maxHeight) {
      element.style.height = `${maxHeight}px`;
      element.style.overflowY = 'auto';
      // Scroll to bottom
      element.scrollTop = element.scrollHeight;
    } else {
      element.style.overflowY = 'hidden';
    }
  };
  
  // Handle input changes for textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    autoResizeTextarea(e.target);
  };

  // Auto focus and scroll to end when defaultValue is set
  useEffect(() => {
    if (defaultValue && textareaRef.current) {
      textareaRef.current.focus();
      autoResizeTextarea(textareaRef.current);
      
      // Set cursor at end of text
      const length = defaultValue.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled && !isEnhancing) {
      onSubmit(prompt.trim());
      // Don't clear the prompt after submission to allow for iterations
    }
  };

  // Function to enhance the prompt using Mistral Small via OpenRouter
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing || isLoading || disabled) return;
    
    try {
      setIsEnhancing(true);
      const enhancedPrompt = await enhancePrompt(prompt, originalImage, isEditing);
      
      // Apply the enhanced prompt
      setPrompt(enhancedPrompt);
      
      // Update textarea height after enhancing
      setTimeout(() => {
        if (textareaRef.current) {
          autoResizeTextarea(textareaRef.current);
          // Scroll to bottom to show latest content
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }, 10);
      
      // Success toast
      toast.success('Prompt enhanced with AI', {
        duration: 1500,
        position: 'top-left'
      });
    } catch (error) {
      // Handle API key missing error
      if ((error as Error).name === 'ApiKeyMissingError') {
        toast.error('API key missing', {
          description: 'Please add your OpenRouter API key to the .env file',
          duration: 1500,
          position: 'top-left'
        });
      } else {
        // Handle generic errors
        toast.error('Failed to enhance prompt', {
          description: 'Please try again or continue with your original prompt',
          duration: 1500,
          position: 'top-left'
        });
      }
      console.error('Enhance prompt error:', error);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  // Example suggestions for the animated placeholder
  const suggestions = isEditing ? [
    "Make the background blurry",
    "Change the sky to a sunset",
    "Apply a vintage film effect",
    "Convert to black and white with high contrast"
  ] : [
    "A 3D rendered image of a dragon with vibrant colors",
    "A photorealistic portrait of a woman with flowers in her hair",
    "A futuristic cityscape with flying cars at sunset",
    "A magical forest with glowing mushrooms"
  ];
  
  return (
    <div className={cn('w-full', className)}>
      {/* Textarea for input with auto-resize */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleTextareaChange}
          placeholder=" " // Empty placeholder since we're using AnimatedPlaceholder
          disabled={isLoading || disabled || isEnhancing}
          rows={1}
          className={cn(
            'w-full p-4 text-sm sm:text-base resize-none rounded-lg font-sans min-h-[6rem]',
            'focus:ring-2 focus:ring-opacity-50 transition-all duration-200 outline-none',
            'shadow-lg',
            darkMode 
              ? 'bg-zinc-800/90 border border-zinc-700/60 focus:ring-indigo-500/30 focus:border-indigo-600/40 text-zinc-200 placeholder:text-zinc-500'
              : 'bg-white border border-gray-200 focus:ring-primary/20 focus:border-primary/40 text-foreground placeholder:text-muted-foreground',
            (isLoading || disabled || isEnhancing) && 'opacity-70 cursor-not-allowed'
          )}
          style={{ 
            overflowY: 'hidden', // Will be changed by autoResize function if needed
            maxHeight: '300px' // Max height for the textarea
          }}
        />
        
        {/* Animated placeholder that shows when empty */}
        {!prompt && (
          <div className={cn(
            "absolute left-4 top-4 pointer-events-none font-sans text-sm sm:text-base", 
            darkMode ? "text-zinc-500" : "text-gray-400"
          )}>
            <AnimatedPlaceholder suggestions={suggestions} />
          </div>
        )}
      </div>
      
      {/* Bottom controls with character count, enhance and submit buttons */}
      <div className="flex justify-between items-center mt-3">
        <span className={cn(
          "text-xs italic",
          darkMode ? "text-zinc-500" : "text-gray-500"
        )}>
          {prompt.length} / 500 chars
        </span>
        
        <div className="flex gap-2">
          {/* Enhance button */}
          <button
            type="button"
            onClick={handleEnhancePrompt}
            disabled={!prompt.trim() || isLoading || disabled || isEnhancing}
            className={cn(
              "px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm transition-colors",
              prompt.trim() && !isLoading && !disabled && !isEnhancing
                ? "bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-800/50"
                : "bg-zinc-800/70 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
            )}
          >
            {isEnhancing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Enhance</span>
          </button>
          
          {/* Generate/Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading || disabled || isEnhancing}
            className={cn(
              "px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm transition-colors font-medium",
              prompt.trim() && !isLoading && !disabled && !isEnhancing
                ? "bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white border border-indigo-700/50"
                : "bg-zinc-800/70 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>{isEditing ? "Apply Edit" : "Generate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
