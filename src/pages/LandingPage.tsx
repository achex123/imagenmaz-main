import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Edit3, Paintbrush, ArrowRight, Sparkles, Camera, Wand2 } from 'lucide-react';
import { getUsageCount } from '@/lib/imageUtils';

const LandingPage = () => {
  const navigate = useNavigate();
  const usageCount = getUsageCount();
  const genCount = localStorage.getItem('gemini-gen-count') || '0';
  const totalCount = usageCount + parseInt(genCount);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans bg-gradient-to-b from-blue-50/50 to-white">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 sm:mb-14 max-w-3xl"
      >
        {/* Logo with glow effect - repositioned */}
        <div className="flex flex-col items-center justify-center mb-6">
          <motion.div 
            className="relative mb-3" // Increased margin bottom
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-blue-600/10 blur-lg"></div>
            <img 
              src="/imagen.png"
              alt="Imagen.ma Logo"
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-md mx-auto"
            />
          </motion.div>
          
          {/* Usage counter moved below with proper spacing */}
          {totalCount > 0 && (
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {totalCount} {totalCount === 1 ? 'creation' : 'creations'} 
                {' '}{usageCount > 0 && genCount !== '0' ? `(${usageCount} edits, ${genCount} images)` : ''}
              </span>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
          <span className="mesh-gradient-text">Imagen.ma</span>
        </h1>
        
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto text-balance mb-2">
          Transform your ideas into images with the power of AI
        </p>
        
        <p className="text-muted-foreground text-base max-w-2xl mx-auto text-balance opacity-80">
          Choose how you want to create today
        </p>
      </motion.div>
      
      {/* Option cards section - completely redesigned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4"
      >
        {/* Image Editor Card - completely new design */}
        <div 
          onClick={() => navigate('/editor')}
          className="group cursor-pointer"
        >
          <div className="premium-card p-0.5 overflow-hidden rounded-2xl hover:scale-[1.02] transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 relative h-full flex flex-col">
              {/* Top pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="blue-grad" gradientTransform="rotate(45)">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <path d="M0,50 Q25,0 50,50 T100,50" stroke="url(#blue-grad)" strokeWidth="3" fill="none" />
                  <path d="M0,60 Q40,10 80,60" stroke="url(#blue-grad)" strokeWidth="2" fill="none" />
                  <path d="M10,80 Q50,30 90,80" stroke="url(#blue-grad)" strokeWidth="2" fill="none" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-blue-500/10 backdrop-blur-sm p-3.5 rounded-xl shadow-sm border border-blue-500/10 transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                    <Edit3 className="h-7 w-7 text-blue-600" />
                  </div>
                  
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-3 group-hover:translate-x-0">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Image Editor</h2>
                
                <p className="text-gray-600 mb-5 text-sm sm:text-base">
                  Transform your existing photos with powerful AI editing. 
                  Describe the changes you want and watch your vision come to life.
                </p>
              </div>
              
              {/* Features list */}
              <div className="relative z-10 mt-auto">
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700 text-sm">
                    <div className="h-5 w-5 mr-2 text-blue-600">
                      <Camera className="h-4 w-4" />
                    </div>
                    <span>Upload your own image</span>
                  </li>
                  <li className="flex items-center text-gray-700 text-sm">
                    <div className="h-5 w-5 mr-2 text-blue-600">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <span>Make precise edits with AI</span>
                  </li>
                  <li className="flex items-center text-gray-700 text-sm">
                    <div className="h-5 w-5 mr-2 text-blue-600">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span>Enhance your photos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Text to Image Card - completely new design */}
        <div 
          onClick={() => navigate('/text-to-image')}
          className="group cursor-pointer"
        >
          <div className="premium-card p-0.5 overflow-hidden rounded-2xl hover:scale-[1.02] transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-8 relative h-full flex flex-col">
              {/* Top pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="purple-grad" gradientTransform="rotate(45)">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="40" r="15" stroke="url(#purple-grad)" strokeWidth="2" fill="none" />
                  <circle cx="70" cy="50" r="10" stroke="url(#purple-grad)" strokeWidth="2" fill="none" />
                  <circle cx="80" cy="30" r="5" stroke="url(#purple-grad)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-500/10 backdrop-blur-sm p-3.5 rounded-xl shadow-sm border border-purple-500/10 transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                    <Paintbrush className="h-7 w-7 text-purple-600" />
                  </div>
                  
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-3 group-hover:translate-x-0">
                    <ArrowRight className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Text to Image</h2>
                
                <p className="text-gray-600 mb-5 text-sm sm:text-base">
                  Create original images from text descriptions. Simply describe what you want to see, 
                  and our AI will bring your words to life.
                </p>
              </div>
              
              {/* Features list */}
              <div className="relative z-10 mt-auto">
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700 text-sm">
                    <div className="h-5 w-5 mr-2 text-purple-600">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span>Generate from any description</span>
                  </li>
                  <li className="flex items-center text-gray-700 text-sm">
                    <div className="h-5 w-5 mr-2 text-purple-600">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <span>Customize styles and aesthetics</span>
                  </li>
                  <li className="flex items-center text-gray-700 text-sm">
                    <div className="h-5 w-5 mr-2 text-purple-600">
                      <Camera className="h-4 w-4" />
                    </div>
                    <span>Download high-quality results</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-14 sm:mt-16 text-center text-xs sm:text-sm text-gray-500"
      >
        <p>Imagen.Ma - AI Image Generation & Editing</p>
        <p className="mt-1.5 text-xs text-gray-400">Advanced AI for high-quality image creation</p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
