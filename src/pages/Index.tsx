import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Download } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Hero section with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-6 sm:mb-12 max-w-3xl"
      >
        {/* Logo image above the welcome message */}
        <motion.img 
          src="/imagen.png"
          alt="Imagen.ma Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 mb-2 sm:mb-4 text-sm rounded-full bg-primary/10 text-primary">
          <Sparkles className="w-4 h-4" />
          <span>{usageCount === 0 ? 'Welcome!' : `You've created ${usageCount} edit${usageCount === 1 ? '' : 's'}`}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4">
          <span className="text-shimmer">Imagen.ma</span> - Edit with AI
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-2 sm:mb-4">
          Transform your photos with the power of AI. Create images with better detail, 
          richer lighting, and diverse art styles from realism to anime.
        </p>
        
        {/* SEO-friendly text that's hidden visually but available to search engines */}
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
      
      {/* Main content section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl"
      >
        <div className="glass p-1 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-background rounded-lg p-4 sm:p-6 lg:p-8">
            {/* Image section */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6 sm:grid-cols-2">
              {/* Original image section */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium">Original Image</p>
                
                {originalImage ? (
                  <div className="relative min-h-[200px] max-h-[400px] w-full bg-secondary/50 rounded-lg overflow-hidden flex items-center justify-center">
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
                <p className="text-sm text-muted-foreground font-medium">Edited Result</p>
                
                {resultImage && !isLoading ? (
                  <div className="relative min-h-[200px] max-h-[400px] w-full bg-secondary/50 rounded-lg overflow-hidden flex items-center justify-center">
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
                  <div className="w-full min-h-[200px] max-h-[400px] flex items-center justify-center bg-secondary/50 rounded-lg overflow-hidden">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center text-center p-6">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium">Generating your edit...</p>
                        <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <p className="text-muted-foreground">
                          {originalImage 
                            ? 'Enter your edit description below' 
                            : 'Upload an image to get started'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Prompt input section */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">Edit Description</p>
                {originalImage && (
                  <button
                    onClick={handleNewEdit}
                    className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground p-1"
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
              />
              
              <p className="text-xs text-muted-foreground">
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
        className="mt-6 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground"
      >
        <p>Imagen.Ma - Powered by Google's Gemini 2.0 Flash AI</p>
        <p className="mt-1">Advanced AI for high-quality image editing and generation</p>
      </motion.div>
    </div>
  );
};

export default Index;
