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
      {/* Enhanced Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-4 py-6 border-b border-zinc-800/50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-zinc-300 hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-lg bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <img 
              src="/imagen.png"
              alt="Imagen.ma"
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-lg font-bold mac-gradient-text">Imagen.ma</span>
          </div>
          
          <Link 
            to="/text-to-image"
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-900/30 text-indigo-300 rounded-lg hover:bg-indigo-900/50 transition-colors border border-indigo-800/50"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Image Generator</span>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-500/20">
                <PenTool className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="block">AI Image</span>
              <span className="block mac-gradient-text">Editor</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your photos with intelligent AI editing. Upload any image and describe the changes you want - our advanced AI will apply professional-grade modifications instantly.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{usageCount}</div>
                <div className="text-sm text-zinc-500">Images Edited</div>
              </div>
              <div className="w-px h-8 bg-zinc-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">AI</div>
                <div className="text-sm text-zinc-500">Powered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tips Section */}
      {!originalImage && (
        <section className="px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/50 rounded-full border border-zinc-700/50">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-zinc-300">Editing Tips</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {editingTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/30 text-center"
                  >
                    <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto text-blue-400">
                      {tip.icon}
                    </div>
                    <h3 className="font-semibold mb-2 text-zinc-200">{tip.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{tip.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Editor */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="mac-card p-0.5 overflow-hidden">
              <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl p-6 sm:p-8 lg:p-9 border border-zinc-800/50 shadow-xl">
                {/* Image section */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-8 lg:grid-cols-2">
                  {/* Original image section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <h3 className="text-lg font-semibold text-zinc-200">Original Image</h3>
                      </div>
                      {originalImage && (
                        <button
                          onClick={handleNewEdit}
                          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 px-3 py-1.5 hover:bg-zinc-800/70 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          New Edit
                        </button>
                      )}
                    </div>
                    
                    {originalImage ? (
                      <div className="relative min-h-[250px] max-h-[500px] w-full rounded-xl overflow-hidden shadow-lg">
                        <ImagePreview 
                          imageUrl={originalImage} 
                          onRemove={removeImage}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <DragDropUpload 
                          onImageSelected={handleImageSelected}
                          className="w-full min-h-[250px] max-h-[500px]"
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs text-white/90 border border-white/10">
                          <Upload className="w-3 h-3" />
                          <span>Upload to start</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Result image section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <h3 className="text-lg font-semibold text-zinc-200">Edited Result</h3>
                    </div>
                    
                    {resultImage && !isLoading ? (
                      <div className="relative min-h-[250px] max-h-[500px] w-full rounded-xl overflow-hidden shadow-lg">
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
                      <div className="w-full min-h-[250px] max-h-[500px] flex items-center justify-center bg-zinc-800/70 rounded-xl overflow-hidden shadow-lg border border-zinc-700/60">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center text-center p-8">
                            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h4 className="text-lg font-medium text-zinc-300 mb-2">AI is working its magic</h4>
                            <p className="text-sm text-zinc-500">Processing your edit request...</p>
                          </div>
                        ) : (
                          <div className="text-center p-8">
                            <div className="w-16 h-16 bg-zinc-700/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                              <Sparkles className="w-8 h-8 text-zinc-500" />
                            </div>
                            <h4 className="text-lg font-medium text-zinc-300 mb-2">
                              {originalImage 
                                ? 'Ready for your edit instructions' 
                                : 'Upload an image to get started'}
                            </h4>
                            <p className="text-sm text-zinc-500">
                              {originalImage 
                                ? 'Describe the changes you want to make below'
                                : 'Drag and drop or click to select an image file'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Prompt input section */}
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 rounded-xl border border-zinc-800/80 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <h3 className="text-lg font-semibold text-zinc-200">Edit Instructions</h3>
                    </div>
                    {originalImage && (
                      <div className="text-xs text-zinc-500">
                        Describe the changes you want to make
                      </div>
                    )}
                  </div>
                  
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-zinc-500">
            Imagen.ma - Professional AI Image Editing Platform
          </p>
          <p className="text-xs text-zinc-600 mt-2">
            Transform your photos with intelligent artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;