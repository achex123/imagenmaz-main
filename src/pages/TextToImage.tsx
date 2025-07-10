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
              <span className="text-lg font-bold mac-gradient-text">AI Generator</span>
            </div>
            
            <Link 
              to="/editor"
              className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-900/30 text-indigo-300 rounded-lg hover:bg-indigo-900/50 transition-colors text-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Editor</span>
            </Link>
          </div>
        </div>
        
        {/* Prominent Input Section */}
        <div className="px-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <TextToImageGenerator showCounter={false} />
          </div>
        </div>
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
              <span className="mac-gradient-text">Create Anything You Imagine</span>
            </h1>
            
            <p className="text-base text-zinc-400 max-w-2xl mx-auto mb-6">
              Describe your vision and watch AI bring it to life instantly
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-400">{genCount}</div>
                <div className="text-sm text-zinc-500">Images Generated</div>
              </div>
              <div className="w-px h-8 bg-zinc-700"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">∞</div>
                <div className="text-sm text-zinc-500">Possibilities</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Inspiration Grid */}
      <section className="px-4 py-6 bg-zinc-800/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-zinc-300">Need Inspiration?</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {inspirationPrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
                  className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-indigo-900/30 rounded-md group-hover:bg-indigo-900/50 transition-colors">
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

      {/* Compact Tips Section */}
      <section className="px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Pro Tips for Better Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                <div className="w-10 h-10 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">Be Descriptive</h3>
                <p className="text-sm text-zinc-400">Include details about style, lighting, colors, and mood for more accurate results.</p>
              </div>
              
              <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                <div className="w-10 h-10 bg-purple-900/40 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">Specify Style</h3>
                <p className="text-sm text-zinc-400">Mention artistic styles like "photorealistic", "oil painting", or "digital art".</p>
              </div>
              
              <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                <div className="w-10 h-10 bg-blue-900/40 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">Use Keywords</h3>
                <p className="text-sm text-zinc-400">Add quality keywords like "high resolution", "detailed", or "professional".</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-zinc-500">
            Imagen.ma - Professional AI Image Generation Platform
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            Create stunning visuals with cutting-edge artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TextToImage;