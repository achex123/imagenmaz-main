import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TextToImageGenerator from '@/components/TextToImageGenerator';

const TextToImage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans bg-gradient-to-b from-blue-50/50 to-white">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl mb-8"
      >
        {/* Navigation links */}
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          
          <Link 
            to="/editor"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Switch to Image Editor
          </Link>
        </div>
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="mesh-gradient-text">Text to Image</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto text-balance">
            Transform your ideas into images with AI. Describe what you want, and watch your imagination come to life.
          </p>
        </div>
      </motion.div>
      
      {/* Generator section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl"
      >
        <TextToImageGenerator />
      </motion.div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-gray-500"
      >
        <p>Imagen.Ma - AI Image Generation & Editing</p>
        <p className="mt-1.5 text-xs text-gray-400">High-quality AI image generation</p>
      </motion.div>
    </div>
  );
};

export default TextToImage;
