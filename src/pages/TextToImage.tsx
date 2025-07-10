import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, ArrowLeft, Sparkles, Lightbulb, Palette, Image as ImageIcon } from 'lucide-react';
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

  const inspirationPrompts = [
    "A serene mountain landscape at golden hour with misty valleys",
    "Futuristic cityscape with flying cars and neon lights",
    "Vintage coffee shop interior with warm lighting and books",
    "Abstract geometric art with vibrant colors and patterns"
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
            to="/editor"
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-900/30 text-indigo-300 rounded-lg hover:bg-indigo-900/50 transition-colors border border-indigo-800/50"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Image Editor</span>
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
              <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/20">
                <Palette className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="block">AI Image</span>
              <span className="block mac-gradient-text">Generator</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your imagination into stunning visuals. Describe any concept, scene, or idea, and watch our advanced AI bring it to life with professional quality.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">{genCount}</div>
                <div className="text-sm text-zinc-500">Images Generated</div>
              </div>
              <div className="w-px h-8 bg-zinc-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">∞</div>
                <div className="text-sm text-zinc-500">Possibilities</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inspiration Section */}
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
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-zinc-300">Need Inspiration?</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inspirationPrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-900/30 rounded-lg group-hover:bg-indigo-900/50 transition-colors">
                      <ImageIcon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">
                      {prompt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Generator */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <TextToImageGenerator showCounter={false} />
          </motion.div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="px-4 py-16 bg-zinc-800/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Pro Tips for Better Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2">Be Descriptive</h3>
                <p className="text-sm text-zinc-400">Include details about style, lighting, colors, and mood for more accurate results.</p>
              </div>
              
              <div className="p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <div className="w-12 h-12 bg-purple-900/40 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Palette className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Specify Style</h3>
                <p className="text-sm text-zinc-400">Mention artistic styles like "photorealistic", "oil painting", or "digital art".</p>
              </div>
              
              <div className="p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <div className="w-12 h-12 bg-blue-900/40 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <ImageIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Use Keywords</h3>
                <p className="text-sm text-zinc-400">Add quality keywords like "high resolution", "detailed", or "professional".</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-zinc-500">
            Imagen.ma - Professional AI Image Generation Platform
          </p>
          <p className="text-xs text-zinc-600 mt-2">
            Create stunning visuals with cutting-edge artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TextToImage;