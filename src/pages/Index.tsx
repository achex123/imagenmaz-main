import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Download, Cpu } from 'lucide-react';
import { toast } from 'sonner';

import DragDropUpload from '@/components/DragDropUpload';
import ImagePreview from '@/components/ImagePreview';
import PromptInput from '@/components/PromptInput';
import { useImageEditor } from '@/hooks/useImageEditor';
import { downloadImage, getUsageCount } from '@/lib/imageUtils';

const Index = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [usageCount, setUsageCount] = useState(0);
  
  const {
    originalImage,
    resultImage,
    isLoading,
    handleImageSelected,
    removeImage,
    processImage,
    continueEditing,
    resetEditor
  } = useImageEditor();
  
  // Check usage count on mount
  useEffect(() => {
    setUsageCount(getUsageCount());
    
    // Set initial load to false after animation
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update usage count when it changes
  useEffect(() => {
    const checkUsageInterval = setInterval(() => {
      const count = getUsageCount();
      if (count !== usageCount) {
        setUsageCount(count);
      }
    }, 5000);
    
    return () => clearInterval(checkUsageInterval);
  }, [usageCount]);
  
  const handleDownload = () => {
    if (resultImage) {
      downloadImage(resultImage);
      toast.success('Image downloaded successfully');
    }
  };
  
  const handleNewEdit = () => {
    resetEditor();
    toast.info('Started new edit session');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans bg-gradient-to-b from-blue-50/50 to-white">
      {/* Hero section with better layout and reduced margins */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-3 sm:mb-6 max-w-3xl" // Reduced bottom margin
      >
        {/* Combined logo and usage count for better layout */}
        <div className="flex flex-col items-center justify-center mb-2"> {/* Reduced margin */}
          {/* Logo with glow effect */}
          <motion.div 
            className="relative mb-2" // Reduced margin
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-blue-600/10 blur-lg"></div>
            <img 
              src="/imagen.png"
              alt="Imagen.ma Logo"
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl shadow-md" // Reduced size
            />
          </motion.div>
          
          {/* Usage counter moved below logo */}
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs sm:text-sm rounded-full bg-primary/10 text-primary border border-primary/10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{usageCount === 0 ? 'Welcome!' : `${usageCount} edit${usageCount === 1 ? '' : 's'} created`}</span>
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2"> {/* Reduced size and margin */}
          <span className="mesh-gradient-text">Imagen.ma</span> <span className="opacity-90">- Edit with AI</span>
        </h1>
        
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto text-balance"> {/* Reduced font size */}
          Transform your photos with the power of AI. Upload an image and describe the changes you want.
        </p>
        
        {/* SEO-friendly hidden text - untouched */}
        <div className="sr-only">
          <h2>High-Quality AI Image Generation</h2>
          <p>
            Imagen 3 is our highest quality text-to-image model, capable of generating images 
            with even better detail, richer lighting and fewer distracting artifacts than 
            previous models. Enjoy better overall color balance and vibrant visuals.
          </p>
          <h2>Diverse Art Styles</h2>
          <p>
            Render diverse art styles with greater accuracy – from photo realism to 
            impressionism, and from abstract to anime. Express your creativity with 
            high-fidelity detail, richer textures and enhanced details for more visually 
            compelling images.
          </p>
        </div>
      </motion.div>
      
      {/* Main content section - closer to the hero with reduced animation delay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} // Reduced delay
        className="w-full max-w-4xl"
      >
        <div className="premium-card p-1 overflow-hidden">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 sm:p-7 lg:p-9">
            {/* Image section */}
            <div className="grid grid-cols-1 gap-5 sm:gap-7 mb-5 sm:mb-7 sm:grid-cols-2">
              {/* Original image section */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Original Image
                </p>
                
                {originalImage ? (
                  <div className="relative min-h-[200px] max-h-[400px] w-full bg-gray-100/70 rounded-lg overflow-hidden flex items-center justify-center shadow-sm transition-all hover:shadow-md">
                    <ImagePreview 
                      imageUrl={originalImage} 
                      onRemove={removeImage}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <DragDropUpload 
                    onImageSelected={handleImageSelected}
                    className="w-full min-h-[200px] max-h-[400px]"
                  />
                )}
              </div>
              
              {/* Result image section */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                  Edited Result
                </p>
                
                {resultImage && !isLoading ? (
                  <div className="relative min-h-[200px] max-h-[400px] w-full bg-gray-100/70 rounded-lg overflow-hidden flex items-center justify-center shadow-sm transition-all hover:shadow-md">
                    <ImagePreview 
                      imageUrl={resultImage} 
                      onRemove={() => resetEditor()}
                      onContinueEdit={continueEditing}
                      onDownload={handleDownload}
                      isResult={true}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full min-h-[200px] max-h-[400px] flex items-center justify-center bg-gray-100/70 rounded-lg overflow-hidden shadow-sm">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center text-center p-6">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium">Generating your edit...</p>
                        <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
                      </div>
                    ) : (
                      <div className="text-center p-6 px-4">
                        <div className="mb-3 opacity-50">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                            <path d="M2 12.5V6.5C2 5.4 2.9 4.5 4 4.5H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.5 11L8 8.5L11 11.5L14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 4.5H14.5C15.6 4.5 16.5 5.4 16.5 6.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 14.5L12 22.5L9.5 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          {originalImage 
                            ? 'Describe your edit below to transform your image' 
                            : 'Upload an image to get started'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Prompt input section with improved design */}
            <div className="space-y-3 sm:space-y-4 bg-gradient-to-r from-gray-50/50 to-blue-50/50 p-4 sm:p-5 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Edit Description
                </p>
                {originalImage && (
                  <button
                    onClick={handleNewEdit}
                    className="inline-flex items-center text-xs text-gray-500 hover:text-gray-900 p-1.5 hover:bg-gray-100/70 rounded-md transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    New Edit
                  </button>
                )}
              </div>
              
              <PromptInput 
                onSubmit={processImage} 
                isLoading={isLoading}
                disabled={!originalImage || isLoading}
                originalImage={originalImage} // Pass original image for context
              />
              
              <p className="text-xs text-gray-500 italic px-1">
                Describe how you want to edit your image. Be specific for better results.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 sm:mt-14 text-center text-xs sm:text-sm text-gray-500"
      >
        <p>Imagen.Ma - Premium AI Image Editor</p>
        <p className="mt-1.5 text-xs text-gray-400">Advanced AI for high-quality image editing and generation</p>
      </motion.div>
    </div>
  );
};

export default Index;
