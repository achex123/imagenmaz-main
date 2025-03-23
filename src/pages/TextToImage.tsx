import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit3, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import TextToImageGenerator from '@/components/TextToImageGenerator';
import { getGenCount } from '@/lib/imageUtils';

const TextToImage = () => {
  const [genCount, setGenCount] = useState(0);

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

  return (
    <div className="min-h-screen flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans bg-zinc-900 text-zinc-200">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl mb-8"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="mac-gradient-text">AI Image Generator</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto text-balance">
            Transform your ideas into stunning images with the power of AI. Just describe what you want to see.
          </p>
        </div>
      </motion.div>
      
      {/* Navigation buttons with counter in center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl flex justify-between items-center mb-8"
      >
        <Link 
          to="/" 
          className="inline-flex items-center text-sm px-4 py-2 rounded-full bg-zinc-800/70 text-indigo-300 hover:bg-zinc-800/90 transition-colors border border-zinc-700/60"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Home
        </Link>
        
        {/* Counter in center */}
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs sm:text-sm rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-800/50 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{genCount === 0 ? 'First generation' : `${genCount} ${genCount === 1 ? 'image' : 'images'} generated`}</span>
        </div>
        
        <Link 
          to="/editor"
          className="inline-flex items-center text-sm px-4 py-2 rounded-full bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50 transition-colors border border-indigo-800/50"
        >
          <Edit3 className="w-4 h-4 mr-1.5" />
          Switch to Editor
        </Link>
      </motion.div>
      
      {/* Generator section - now passing showCounter=false to avoid duplicate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl"
      >
        <TextToImageGenerator showCounter={false} />
      </motion.div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-zinc-500"
      >
        <p>Imagen.Ma - Premium AI Image Editor</p>
        <p className="mt-1.5 text-xs text-zinc-600">Advanced AI for high-quality image generation</p>
      </motion.div>
    </div>
  );
};

export default TextToImage;
