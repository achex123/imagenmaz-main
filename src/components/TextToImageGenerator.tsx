import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Loader2, Trash2, Maximize2, Edit3, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateImageFromText } from '@/lib/textToImage';
import { downloadImage, getGenCount, incrementGenCount } from '@/lib/imageUtils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import PromptInput from './PromptInput';
import FullScreenImageViewer from './FullScreenImageViewer';
import ImageAnalysisUploader from './ImageAnalysisUploader';

interface TextToImageGeneratorProps {
  className?: string;
}

const TextToImageGenerator: React.FC<TextToImageGeneratorProps> = ({ className }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [analyzeMode, setAnalyzeMode] = useState(false);
  const navigate = useNavigate();
  const [promptKey, setPromptKey] = useState(0);
  
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
  
  const handleGenerate = async (inputPrompt: string) => {
    if (!inputPrompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setPrompt(inputPrompt);
    
    try {
      const result = await generateImageFromText(inputPrompt);
      
      if (result.success && result.data.imageUrl) {
        setGeneratedImage(result.data.imageUrl);
        // Increment the generation count
        incrementGenCount();
        setGenCount(getGenCount());
        toast.success('Image generated successfully');
      } else {
        toast.error(result.data.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Generation error:', error);
      
      // More descriptive error message
      let errorMessage = 'An error occurred during image generation';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        description: 'Please try a different prompt or try again later.'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, 'generated-image.jpg');
      toast.success('Image downloaded successfully');
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
        description: 'You can now make further edits to your generated image'
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
          <p className="font-medium text-sm">Image analyzed with Gemini</p>
          <p className="text-xs text-gray-500">Description has been added to the prompt field</p>
        </div>
      </div>
    );
    
    // Force update PromptInput component by using a key
    setPromptKey(prev => prev + 1);
  };
  
  const toggleImageUploader = () => {
    setShowImageUploader(!showImageUploader);
    setAnalyzeMode(true);
  };
  
  return (
    <div className={cn('w-full max-w-3xl mx-auto', className)}>
      <div className="premium-card p-1 overflow-hidden">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 sm:p-7">
          {/* Usage counter for generations */}
          <div className="mb-4 flex justify-between items-center">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs sm:text-sm rounded-full bg-purple-100/70 text-purple-600 border border-purple-200/50 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{genCount === 0 ? 'First generation' : `${genCount} ${genCount === 1 ? 'image' : 'images'} generated`}</span>
            </div>
            
            <button
              onClick={toggleImageUploader}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {showImageUploader ? 'Hide Image Uploader' : 'Use Reference Image'}
            </button>
          </div>
          
          {/* Image analysis uploader - conditionally shown */}
          {showImageUploader && (
            <div className="mb-5">
              <ImageAnalysisUploader 
                onAnalysisComplete={handleImageAnalysisComplete}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Supports JPG, PNG and GIF up to 10MB
              </p>
            </div>
          )}
          
          {/* Title section - simplified */}
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold mb-2">AI Image Creator</h2>
          </div>
          
          {/* Result display with edit button */}
          {generatedImage && (
            <div className="mb-6">
              <div 
                className="relative rounded-lg overflow-hidden bg-gray-100/70 shadow-md cursor-zoom-in"
                onClick={() => setIsFullScreen(true)}
              >
                <img 
                  src={generatedImage} 
                  alt="Generated image" 
                  className="w-full h-auto max-h-[500px] object-contain" // Increased max height
                  loading="lazy" // Add lazy loading for larger images
                />
                
                {/* Image info badge */}
                <div className="absolute top-2 left-14 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white opacity-70">
                  High Quality
                </div>
                
                {/* Fullscreen indicator */}
                <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm rounded-full p-1.5 text-white opacity-60 group-hover:opacity-80 transition-opacity duration-200 shadow-sm">
                  <Maximize2 className="w-4 h-4" />
                </div>
                
                <div className="absolute top-2 right-2 flex space-x-2">
                  {/* New Edit button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditInEditor();
                    }}
                    className="p-2 bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600 transition-colors"
                    title="Edit in Image Editor"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    className="p-2 bg-primary text-white rounded-full shadow-sm hover:bg-primary/90 transition-colors"
                    title="Download image"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="p-2 bg-red-500/80 text-white rounded-full shadow-sm hover:bg-red-500 transition-colors"
                    title="Clear image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Add edit button tooltip/label at bottom of image */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to view fullscreen or use buttons to edit/download
                </div>
              </div>
            </div>
          )}
          
          {/* Use the improved PromptInput component */}
          <div className="space-y-3">
            <PromptInput 
              key={promptKey} // Add key to force re-render when prompt changes
              onSubmit={handleGenerate} 
              isLoading={isGenerating}
              disabled={isGenerating} 
              isEditing={false} // This is for text-to-image generation, not editing
              defaultValue={prompt} // Pass the prompt from image analysis
            />
            
            <p className="text-center text-xs text-gray-500 italic">
              {analyzeMode 
                ? 'Review the Gemini-generated description and click Generate to create a similar image' 
                : 'Image generation may take 10-20 seconds.'}
            </p>
          </div>
          
          {/* Fullscreen viewer with edit button */}
          {generatedImage && (
            <FullScreenImageViewer
              imageUrl={generatedImage}
              isOpen={isFullScreen}
              onClose={() => setIsFullScreen(false)}
              onDownload={handleDownload}
              extraActions={[
                {
                  icon: <Edit3 className="w-5 h-5" />,
                  label: "Edit in Image Editor",
                  onClick: handleEditInEditor,
                  className: "bg-blue-600/80 hover:bg-blue-600"
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
