import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Loader2, Trash2, Maximize2, Edit3, Image as ImageIcon, Wand2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateImageFromText } from '@/lib/textToImage';
import { downloadImage, getGenCount, incrementGenCount } from '@/lib/imageUtils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import PromptInput from './PromptInput';
import FullScreenImageViewer from './FullScreenImageViewer';
import ImageAnalysisUploader from './ImageAnalysisUploader';
import { enhancePrompt } from '@/lib/enhancePrompt';

interface TextToImageGeneratorProps {
  className?: string;
  showCounter?: boolean;
}

// Storing generation history
interface GenerationResult {
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

const TextToImageGenerator: React.FC<TextToImageGeneratorProps> = ({ 
  className,
  showCounter = false 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState(''); // Store the original prompt
  const [generationHistory, setGenerationHistory] = useState<GenerationResult[]>([]); // Track history
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0); // Current view
  const [analyzeMode, setAnalyzeMode] = useState(false);
  const navigate = useNavigate();
  const [promptKey, setPromptKey] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [iterationMode, setIterationMode] = useState(false); // Are we in iteration mode?
  
  // Get and update generation count
  useEffect(() => {
    setGenCount(getGenCount());
    
    const checkGenInterval = setInterval(() => {
      const count = getGenCount();
      if (count !== genCount) {
        setGenCount(count);
      }
    }, 5000);
    
    return () => clearInterval(checkGenInterval);
  }, [genCount]);

  // When switching history items, update the display
  useEffect(() => {
    if (generationHistory.length > 0 && currentHistoryIndex < generationHistory.length) {
      const currentItem = generationHistory[currentHistoryIndex];
      setGeneratedImage(currentItem.imageUrl);
      
      // Only update prompt when in iteration mode
      if (iterationMode) {
        setPrompt(currentItem.prompt);
        setPromptKey(prev => prev + 1);
      }
    }
  }, [currentHistoryIndex, generationHistory, iterationMode]);
  
  const handleGenerate = async (inputPrompt: string) => {
    if (!inputPrompt.trim() || isGenerating) return;
    
    // Store original prompt for future iterations if this is first generation
    if (!generatedImage && !iterationMode) {
      setOriginalPrompt(inputPrompt);
    }
    
    setIsGenerating(true);
    setPrompt(inputPrompt);
    
    try {
      const result = await generateImageFromText(inputPrompt);
      
      if (result.success && result.data.imageUrl) {
        setGeneratedImage(result.data.imageUrl);
        
        // Save this result to history
        const newEntry: GenerationResult = {
          imageUrl: result.data.imageUrl,
          prompt: inputPrompt,
          timestamp: Date.now()
        };
        
        const updatedHistory = [...generationHistory, newEntry];
        setGenerationHistory(updatedHistory);
        setCurrentHistoryIndex(updatedHistory.length - 1);
        
        // Increment the generation count
        incrementGenCount();
        setGenCount(getGenCount());
        
        // Set iteration mode to true after first successful generation
        setIterationMode(true);
        
        toast.success('Image generated successfully', {
          duration: 1500,
          position: 'top-left'
        });
      } else {
        toast.error(result.data.message || 'Failed to generate image', {
          duration: 1500,
          position: 'top-left'
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      
      let errorMessage = 'An error occurred during image generation';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        description: 'Please try a different prompt or try again later.',
        duration: 1500,
        position: 'top-left'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePreviousImage = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  };
  
  const handleNextImage = () => {
    if (currentHistoryIndex < generationHistory.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  };
  
  // Clear current results and reset to initial state
  const handleStartOver = () => {
    setGeneratedImage(null);
    setPrompt('');
    setOriginalPrompt('');
    setGenerationHistory([]);
    setCurrentHistoryIndex(0);
    setIterationMode(false);
    setPromptKey(prev => prev + 1);
  };
  
  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, 'generated-image.jpg');
      toast.success('Image downloaded successfully', {
        duration: 1500, // 1.5 seconds for toast
        position: 'top-left' // Changed position to top-left
      });
    }
  };
  
  const handleClear = () => {
    setGeneratedImage(null);
  };

  const handleEditInEditor = () => {
    if (generatedImage) {
      // Store the generated image in sessionStorage to retrieve it in the editor
      sessionStorage.setItem('editImage', generatedImage);
      // Navigate to the editor page
      navigate('/editor?source=text-to-image');
      toast.success('Image sent to editor', {
        description: 'You can now make further edits to your generated image',
        duration: 1500, // 1.5 seconds for toast
        position: 'top-left' // Changed position to top-left
      });
    }
  };
  
  const handleImageAnalysisComplete = (imageUrl: string, description: string) => {
    // Set the generated description as the prompt
    setPrompt(description);
    setAnalyzeMode(false);
    setShowImageUploader(false);
    
    // Show a toast with a small preview
    toast.success(
      <div className="flex items-start gap-3">
        <img 
          src={imageUrl} 
          alt="Reference" 
          className="w-12 h-12 object-cover rounded-md" 
        />
        <div>
          <p className="font-medium text-sm">Image analyzed!</p>
          <p className="text-xs text-gray-500">Description has been added</p>
        </div>
      </div>,
      {
        duration: 1500, // 1.5 seconds for toast
        position: 'top-left' // Changed position to top-left
      }
    );
    
    // Force update PromptInput component by using a key
    setPromptKey(prev => prev + 1);
  };
  
  const toggleImageUploader = () => {
    setShowImageUploader(!showImageUploader);
    setAnalyzeMode(true);
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    
    try {
      setIsEnhancing(true);
      const enhancedPrompt = await enhancePrompt(prompt, undefined, false);
      
      // Apply the enhanced prompt
      setPrompt(enhancedPrompt);
      
      toast.success('Prompt enhanced', {
        duration: 1500,
        position: 'top-left'
      });
    } catch (error) {
      toast.error('Failed to enhance prompt', {
        duration: 1500,
        position: 'top-left'
      });
      console.error('Enhance prompt error:', error);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <div className="mac-card p-0.5 overflow-hidden">
        <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl p-6 sm:p-8 lg:p-9 border border-zinc-800/50 shadow-xl">
          {/* Show counter only if requested */}
          {showCounter && (
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs sm:text-sm rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-800/50 shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{genCount === 0 ? 'First generation' : `${genCount} ${genCount === 1 ? 'image' : 'images'} generated`}</span>
              </div>
            </div>
          )}
          
          {/* Reference image button and top controls */}
          <div className="flex justify-between items-center mb-4">
            {/* Left side of header */}
            {generatedImage && generationHistory.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors border border-zinc-700/70"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Start New
                </button>
                
                <div className="text-xs text-zinc-500">
                  {currentHistoryIndex + 1}/{generationHistory.length}
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={handlePreviousImage}
                    disabled={currentHistoryIndex === 0}
                    className={cn(
                      "p-1.5 rounded-md",
                      currentHistoryIndex === 0
                        ? "text-zinc-600 cursor-not-allowed"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    )}
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={currentHistoryIndex === generationHistory.length - 1}
                    className={cn(
                      "p-1.5 rounded-md",
                      currentHistoryIndex === generationHistory.length - 1
                        ? "text-zinc-600 cursor-not-allowed"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    )}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
            
            {/* Right side of header */}
            <div className={generatedImage && generationHistory.length > 1 ? '' : 'ml-auto'}>
              <button
                onClick={toggleImageUploader}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors border border-zinc-700/70"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {showImageUploader ? 'Hide Reference Image' : 'Use Reference Image'}
              </button>
            </div>
          </div>
          
          {/* Image analysis uploader - conditionally shown */}
          {showImageUploader && (
            <div className="mb-5">
              <ImageAnalysisUploader 
                onAnalysisComplete={handleImageAnalysisComplete}
                className="w-full"
              />
              <p className="text-xs text-zinc-500 mt-1 text-center">
                Supports JPG, PNG and GIF up to 10MB
              </p>
            </div>
          )}
          
          {/* Updated prompt input component with consistent styling */}
          <div className="mb-6">
            <PromptInput 
              key={promptKey}
              onSubmit={handleGenerate} 
              isLoading={isGenerating}
              disabled={isGenerating || isEnhancing} 
              isEditing={false}
              defaultValue={prompt}
              darkMode={true}
            />
            
            {/* Generate Variation Button REMOVED */}
          </div>
          
          {/* Result display with edit button */}
          {generatedImage && (
            <div className="mb-6">
              <div 
                className="relative rounded-xl overflow-hidden bg-zinc-800/70 shadow-lg cursor-zoom-in border border-zinc-700/60"
                onClick={() => setIsFullScreen(true)}
              >
                <img 
                  src={generatedImage} 
                  alt="Generated image" 
                  className="w-full h-auto max-h-[500px] object-contain" 
                  loading="lazy"
                />
                
                {/* Image info badge */}
                <div className="absolute top-2 left-14 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 text-xs text-white/90 border border-white/10">
                  High Quality
                </div>
                
                {/* Fullscreen indicator */}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md rounded-full p-1.5 text-white/90 opacity-70 group-hover:opacity-100 transition-opacity duration-200 shadow-sm border border-white/10">
                  <Maximize2 className="w-4 h-4" />
                </div>
                
                <div className="absolute top-2 right-2 flex space-x-2">
                  {/* Edit button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditInEditor();
                    }}
                    className="p-2 bg-indigo-600/80 text-white rounded-full shadow-md hover:bg-indigo-500 transition-colors border border-indigo-700/50"
                    title="Edit in Image Editor"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    className="p-2 bg-indigo-600/80 text-white rounded-full shadow-md hover:bg-indigo-500 transition-colors border border-indigo-700/50"
                    title="Download image"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="p-2 bg-zinc-700/80 text-white rounded-full shadow-md hover:bg-zinc-600 transition-colors border border-zinc-600/50"
                    title="Clear image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Fullscreen viewer with edit button */}
          {generatedImage && (
            <FullScreenImageViewer
              imageUrl={generatedImage}
              isOpen={isFullScreen}
              onClose={() => setIsFullScreen(false)}
              onDownload={handleDownload}
              darkMode={true}
              extraActions={[
                {
                  icon: <Edit3 className="w-5 h-5" />,
                  label: "Edit in Image Editor",
                  onClick: handleEditInEditor,
                  className: "bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-700/50"
                }
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToImageGenerator;
