import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Download, PenTool, ArrowLeft, Upload, Zap, Target } from 'lucide-react';
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

  const editingTips = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Be Specific",
      description: "Describe exactly what you want to change"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Use Keywords",
      description: "Include style, lighting, and quality terms"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Iterate",
      description: "Refine your edits step by step"
    }
  ];
  
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200">
      {/* Sticky Input Bar at Top */}
      <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800/50">
        <div className="px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <img 
                src="/imagen.png"
                alt="Imagen.ma"
                className="w-6 h-6 rounded-lg"
              />
              <span className="text-lg font-bold mac-gradient-text">AI Editor</span>
            </div>
            
            <Link 
              to="/text-to-image"
              className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-900/30 text-indigo-300 rounded-lg hover:bg-indigo-900/50 transition-colors text-sm"
            >
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">Generator</span>
            </Link>
          </div>
        </div>
        
        {/* Prominent Input Section */}
        {originalImage && (
          <div className="px-4 pb-4">
            <div className="max-w-4xl mx-auto">
              <PromptInput 
                onSubmit={processImage} 
                isLoading={isLoading}
                disabled={!originalImage || isLoading}
                originalImage={originalImage}
                isEditing={true}
                darkMode={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Compact Hero Section */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              <span className="mac-gradient-text">Transform Your Photos with AI</span>
            </h1>
            
            <p className="text-base text-zinc-400 max-w-2xl mx-auto mb-6">
              Upload any image and describe the changes you want
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{usageCount}</div>
                <div className="text-sm text-zinc-500">Images Edited</div>
              </div>
              <div className="w-px h-8 bg-zinc-700"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-400">AI</div>
                <div className="text-sm text-zinc-500">Powered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tips Section */}
      {!originalImage && (
        <section className="px-4 py-6 bg-zinc-800/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-zinc-300">Editing Tips</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {editingTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
                    className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 text-center"
                  >
                    <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto text-blue-400">
                      {tip.icon}
                    </div>
                    <h3 className="font-semibold mb-2 text-zinc-200 text-sm">{tip.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{tip.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Editor */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Horizontal Layout for Images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="mac-card p-0.5 overflow-hidden">
                <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl p-4 border border-zinc-800/50 shadow-xl">
                  {/* Original image section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Original
                      </h3>
                      {originalImage && (
                        <button
                          onClick={handleNewEdit}
                          className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 hover:bg-zinc-800/70 rounded transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    {originalImage ? (
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
                        <ImagePreview 
                          imageUrl={originalImage} 
                          onRemove={removeImage}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <DragDropUpload 
                          onImageSelected={handleImageSelected}
                          className="w-full aspect-square"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs text-white/90">
                          <Upload className="w-3 h-3" />
                          <span className="hidden sm:inline">Upload</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mac-card p-0.5 overflow-hidden">
                <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl p-4 border border-zinc-800/50 shadow-xl">
                  {/* Result image section */}
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      Result
                    </h3>
                    
                    {resultImage && !isLoading ? (
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
                        <ImagePreview 
                          imageUrl={resultImage} 
                          onRemove={() => resetEditor()}
                          onContinueEdit={continueEditing}
                          onDownload={handleDownload}
                          isResult={true}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center bg-zinc-800/70 rounded-lg overflow-hidden shadow-lg border border-zinc-700/60">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center text-center p-6">
                            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h4 className="text-sm font-medium text-zinc-300 mb-1">Processing...</h4>
                            <p className="text-xs text-zinc-500">AI is working</p>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <div className="w-12 h-12 bg-zinc-700/50 rounded-full flex items-center justify-center mb-3 mx-auto">
                              <Sparkles className="w-6 h-6 text-zinc-500" />
                            </div>
                            <h4 className="text-sm font-medium text-zinc-300 mb-1">
                              {originalImage 
                                ? 'Ready to edit' 
                                : 'Upload first'}
                            </h4>
                            <p className="text-xs text-zinc-500">
                              {originalImage 
                                ? 'Use the input above'
                                : 'Select an image file'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Input section only shown when no image is uploaded */}
            {!originalImage && (
              <div className="mac-card p-0.5 overflow-hidden">
                <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl p-6 border border-zinc-800/50 shadow-xl">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-zinc-200 mb-2">Get Started</h3>
                    <p className="text-zinc-400 mb-4">Upload an image above to begin editing with AI</p>
                    
                    <div className="max-w-md mx-auto">
                      <DragDropUpload 
                        onImageSelected={handleImageSelected}
                        className="w-full min-h-[200px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-zinc-500">
            Imagen.ma - Professional AI Image Editing Platform
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            Transform your photos with intelligent artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;