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
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isLoading = false,
  defaultValue = '',
  className,
  disabled = false,
  originalImage,
  isEditing = true // Default to editing mode as that's the main use case
}) => {
  const [prompt, setPrompt] = useState(defaultValue);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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
      
      // Update toast to reflect Mistral-only enhancement
      toast.success('Prompt enhanced with Mistral AI', {
        description: isEditing 
          ? (originalImage 
             ? 'Your edit was refined based on image context and text analysis'
             : 'Your edit description has been refined for better results')
          : 'Your description was enhanced for better image generation'
      });
    } catch (error) {
      // Handle API key missing error
      if ((error as Error).name === 'ApiKeyMissingError') {
        toast.error('API key missing', {
          description: 'Please add your OpenRouter API key to the .env file'
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
    <form onSubmit={handleSubmit} className={cn('w-full space-y-3', className)}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {isEditing
            ? "Describe how you want to edit the image"
            : "Describe the image you want to generate"}
        </p>
      </div>
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder=" " // Empty placeholder since we're using AnimatedPlaceholder
          disabled={isLoading || disabled || isEnhancing}
          rows={1}
          className={cn(
            'w-full p-4 pr-24 text-sm sm:text-base resize-none overflow-hidden rounded-lg font-sans',
            'bg-white border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
            'shadow-sm transition-all duration-200 outline-none',
            'placeholder:text-muted-foreground min-h-[60px]',
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
              'absolute right-14 top-2.5 p-2 rounded-md',
              'transition-all duration-200 group',
              isEnhancing ? 'bg-indigo-100 text-indigo-600 shadow-sm' :
                prompt.trim() && !isLoading && !disabled
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
            title="Refine your description"
          >
            {isEnhancing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="absolute -top-10 right-0 bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border border-indigo-100">
                  {isEditing ? "Refine Edit" : "Enhance Prompt"}
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
            'absolute right-2.5 top-2.5 p-2 rounded-md',
            'transition-all duration-200',
            prompt.trim() && !isLoading && !disabled && !isEnhancing
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-600 active:shadow-inner'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          <Wand2 className={cn(
            'w-4 h-4',
            isLoading && 'animate-pulse'
          )} />
        </button>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span className="italic">Be specific about the changes you want to see.</span>
        <span>{prompt.length} / 500 chars</span>
      </div>
    </form>
  );
};

export default PromptInput;
