import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Download, Cpu, PenTool, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useLocation } from 'react-router-dom';

import DragDropUpload from '@/components/DragDropUpload';
import ImagePreview from '@/components/ImagePreview';
import PromptInput from '@/components/PromptInput';
import { useImageEditor } from '@/hooks/useImageEditor';
import { downloadImage, getUsageCount, getGenCount } from '@/lib/imageUtils';

const Index = () => {
  const location = useLocation();
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
  
  // Check for images from text-to-image on mount
  useEffect(() => {
    // Check if there's a stored image from the text-to-image generator
    const editImage = sessionStorage.getItem('editImage');
    if (editImage) {
      // Clear the storage after retrieving the image
      sessionStorage.removeItem('editImage');
      
      // Create a dummy File object or handle the base64 image directly
      // This depends on how handleImageSelected is implemented
      const base64Data = editImage;
      
      // Process the image
      handleImageSelected(base64Data);
      
      // Show welcome toast if coming from text-to-image page
      if (location.search.includes('source=text-to-image')) {
        toast.success('Image ready to edit', {
          description: 'You can now make edits to your generated image'
        });
      }
    }
  }, [handleImageSelected, location]);
  
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
    <div className="min-h-screen flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans bg-gradient-to-b from-blue-50/50 to-white">
      {/* Header section with navigation links */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl mb-8"
      >
        {/* Navigation links - now matching Text-to-Image layout */}
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          
          <Link 
            to="/text-to-image"
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors"
          >
            <PenTool className="w-4 h-4 mr-1" />
            Switch to Text-to-Image
          </Link>
        </div>
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="mesh-gradient-text">Image Editor</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto text-balance">
            Transform your photos with the power of AI. Upload an image and describe the changes you want.
          </p>
        </div>
      </motion.div>
      
      {/* Main content section - hide usage count from here, moved to landing page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl"
      >
        <div className="premium-card p-1 overflow-hidden">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 sm:p-7 lg:p-9">
            {/* Usage counter with improved layout */}
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs sm:text-sm rounded-full bg-blue-100/70 text-blue-600 border border-blue-200/50 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{usageCount === 0 ? 'First edit' : `${usageCount} ${usageCount === 1 ? 'edit' : 'edits'}`}</span>
              </div>
            </div>
            
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
                originalImage={originalImage}
                isEditing={true}
              />
              
              {/* Removed redundant helper text, keeping only the character counter */}
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
