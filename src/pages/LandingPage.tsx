import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Edit3, Paintbrush, ArrowRight, Sparkles, Camera, Wand2 } from 'lucide-react';
import { getUsageCount } from '@/lib/imageUtils';

const LandingPage = () => {
  const navigate = useNavigate();
  const usageCount = getUsageCount();
  const genCount = localStorage.getItem('gemini-gen-count') || '0';
  const totalCount = usageCount + parseInt(genCount);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans bg-zinc-900 text-zinc-200">
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
            className="relative mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-2xl"></div>
            <img 
              src="/imagen.png"
              alt="Imagen.ma Logo"
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-lg mx-auto"
            />
          </motion.div>
          
          {/* Usage counter moved below with proper spacing */}
          {totalCount > 0 && (
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-800/50 shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {totalCount} {totalCount === 1 ? 'creation' : 'creations'} 
                {' '}{usageCount > 0 && genCount !== '0' ? `(${usageCount} edits, ${genCount} images)` : ''}
              </span>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
          <span className="mac-gradient-text">Imagen.ma</span>
        </h1>
        
        <p className="text-zinc-300 text-lg sm:text-xl max-w-2xl mx-auto text-balance mb-3">
          Transform your ideas into images with the power of AI
        </p>
        
        <p className="text-zinc-400 text-base max-w-2xl mx-auto text-balance">
          Choose how you want to create today
        </p>
      </motion.div>
      
      {/* Option cards section - reordered with Text to Image first */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4"
      >
        {/* Text to Image Card - FIRST (left) position */}
        <div 
          onClick={() => navigate('/text-to-image')}
          className="group cursor-pointer"
        >
          <div className="mac-card p-0.5 overflow-hidden rounded-xl hover:scale-[1.02] transition-all duration-300">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-7 relative h-full flex flex-col border border-zinc-800/60">
              {/* Top pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gray-grad" gradientTransform="rotate(45)">
                      <stop offset="0%" stopColor="#71717a" />
                      <stop offset="100%" stopColor="#3f3f46" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="40" r="15" stroke="url(#gray-grad)" strokeWidth="2" fill="none" />
                  <circle cx="70" cy="50" r="10" stroke="url(#gray-grad)" strokeWidth="2" fill="none" />
                  <circle cx="80" cy="30" r="5" stroke="url(#gray-grad)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-zinc-700/40 backdrop-blur-sm p-3.5 rounded-xl shadow-md border border-zinc-600/50 transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <Paintbrush className="h-7 w-7 text-zinc-300" />
                  </div>
                  
                  <div className="h-10 w-10 rounded-full bg-zinc-700/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-3 group-hover:translate-x-0 border border-zinc-600/50">
                    <ArrowRight className="h-5 w-5 text-zinc-300" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Text to Image</h2>
                
                <p className="text-zinc-400 mb-5 text-sm sm:text-base">
                  Create original images from text descriptions. Simply describe what you want to see, 
                  and our AI will bring your words to life.
                </p>
              </div>
              
              {/* Features list */}
              <div className="relative z-10 mt-auto">
                <ul className="space-y-2.5">
                  <li className="flex items-center text-zinc-300 text-sm">
                    <div className="h-5 w-5 mr-2 text-zinc-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span>Generate from any description</span>
                  </li>
                  <li className="flex items-center text-zinc-300 text-sm">
                    <div className="h-5 w-5 mr-2 text-zinc-400">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <span>Customize styles and aesthetics</span>
                  </li>
                  <li className="flex items-center text-zinc-300 text-sm">
                    <div className="h-5 w-5 mr-2 text-zinc-400">
                      <Camera className="h-4 w-4" />
                    </div>
                    <span>Download high-quality results</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Editor Card - SECOND (right) position */}
        <div 
          onClick={() => navigate('/editor')}
          className="group cursor-pointer"
        >
          <div className="mac-card p-0.5 overflow-hidden rounded-xl hover:scale-[1.02] transition-all duration-300">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-7 relative h-full flex flex-col border border-zinc-800/60">
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
                  <div className="bg-indigo-900/40 backdrop-blur-sm p-3.5 rounded-xl shadow-md border border-indigo-800/50 transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <Edit3 className="h-7 w-7 text-indigo-300" />
                  </div>
                  
                  <div className="h-10 w-10 rounded-full bg-indigo-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-3 group-hover:translate-x-0 border border-indigo-800/50">
                    <ArrowRight className="h-5 w-5 text-indigo-300" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Image Editor</h2>
                
                <p className="text-zinc-400 mb-5 text-sm sm:text-base">
                  Transform your existing photos with powerful AI editing. 
                  Describe the changes you want and watch your vision come to life.
                </p>
              </div>
              
              {/* Features list */}
              <div className="relative z-10 mt-auto">
                <ul className="space-y-2.5">
                  <li className="flex items-center text-zinc-300 text-sm">
                    <div className="h-5 w-5 mr-2 text-indigo-400">
                      <Camera className="h-4 w-4" />
                    </div>
                    <span>Upload your own image</span>
                  </li>
                  <li className="flex items-center text-zinc-300 text-sm">
                    <div className="h-5 w-5 mr-2 text-indigo-400">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <span>Make precise edits with AI</span>
                  </li>
                  <li className="flex items-center text-zinc-300 text-sm">
                    <div className="h-5 w-5 mr-2 text-indigo-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span>Enhance your photos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer section - updated with links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-14 sm:mt-16 text-center"
      >
        <p className="text-xs sm:text-sm text-zinc-500">Imagen.Ma - AI Image Generation & Editing</p>
        <p className="mt-1.5 text-xs text-zinc-600">Advanced AI for high-quality image creation</p>
        
        {/* Legal links */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-zinc-500">
          <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-zinc-700">|</span>
          <Link to="/terms" className="hover:text-indigo-400 transition-colors">
            Terms of Use
          </Link>
        </div>
        
        <p className="mt-3 text-xs text-zinc-700">
          © {new Date().getFullYear()} Imagen.ma. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
