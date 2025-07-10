import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Edit3, Paintbrush, ArrowRight, Sparkles, Camera, Wand2, Star, Zap, Shield, Users } from 'lucide-react';
import { getUsageCount } from '@/lib/imageUtils';

const LandingPage = () => {
  const navigate = useNavigate();
  const usageCount = getUsageCount();
  const genCount = localStorage.getItem('gemini-gen-count') || '0';
  const totalCount = usageCount + parseInt(genCount);

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Lightning Fast",
      description: "Generate and edit images in seconds with our optimized AI pipeline"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Privacy First",
      description: "Your images are processed securely without storing on our servers"
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Professional Quality",
      description: "High-resolution outputs perfect for professional and creative use"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "User Friendly",
      description: "Intuitive interface designed for both beginners and professionals"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-4 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/imagen.png"
              alt="Imagen.ma"
              className="w-10 h-10 rounded-lg shadow-lg"
            />
            <span className="text-xl font-bold mac-gradient-text">Imagen.ma</span>
          </div>
          
          {totalCount > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-900/30 rounded-full border border-indigo-800/50">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300">
                {totalCount} creations made
              </span>
            </div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block">Transform Ideas Into</span>
              <span className="block mac-gradient-text">Stunning Visuals</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Professional AI-powered image generation and editing. Create, enhance, and transform your visual content with cutting-edge artificial intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                onClick={() => navigate('/text-to-image')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                <Paintbrush className="w-5 h-5" />
                Start Creating
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/editor')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-zinc-800/80 border border-zinc-700 rounded-xl font-semibold text-zinc-200 hover:bg-zinc-700/80 transition-all duration-300 flex items-center gap-3"
              >
                <Edit3 className="w-5 h-5" />
                Edit Images
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-zinc-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="mac-gradient-text">Imagen.ma</span>?
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Experience the future of image creation with our advanced AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-zinc-200">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tools Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful AI Tools at Your Fingertips
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Choose the perfect tool for your creative workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text to Image Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => navigate('/text-to-image')}
              className="group cursor-pointer"
            >
              <div className="mac-card p-0.5 overflow-hidden rounded-2xl hover:scale-[1.02] transition-all duration-500">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 relative h-full flex flex-col border border-zinc-800/60">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="paint-grad" gradientTransform="rotate(45)">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                      <circle cx="70" cy="30" r="20" stroke="url(#paint-grad)" strokeWidth="2" fill="none" />
                      <circle cx="50" cy="60" r="15" stroke="url(#paint-grad)" strokeWidth="2" fill="none" />
                      <circle cx="80" cy="70" r="10" stroke="url(#paint-grad)" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-indigo-500/20 transform transition-transform duration-300 group-hover:scale-110">
                        <Paintbrush className="h-8 w-8 text-indigo-400" />
                      </div>
                      
                      <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 border border-indigo-500/30">
                        <ArrowRight className="h-6 w-6 text-indigo-400" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">AI Image Generator</h3>
                    
                    <p className="text-zinc-400 mb-6 text-base leading-relaxed">
                      Transform your imagination into reality. Describe any scene, object, or concept, and watch our advanced AI create stunning, high-quality images that match your vision perfectly.
                    </p>
                  </div>
                  
                  <div className="relative z-10 mt-auto">
                    <div className="space-y-3">
                      <div className="flex items-center text-zinc-300 text-sm">
                        <Sparkles className="h-4 w-4 mr-3 text-indigo-400" />
                        <span>Generate from any text description</span>
                      </div>
                      <div className="flex items-center text-zinc-300 text-sm">
                        <Wand2 className="h-4 w-4 mr-3 text-indigo-400" />
                        <span>Multiple artistic styles and formats</span>
                      </div>
                      <div className="flex items-center text-zinc-300 text-sm">
                        <Camera className="h-4 w-4 mr-3 text-indigo-400" />
                        <span>High-resolution professional output</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Image Editor Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => navigate('/editor')}
              className="group cursor-pointer"
            >
              <div className="mac-card p-0.5 overflow-hidden rounded-2xl hover:scale-[1.02] transition-all duration-500">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 relative h-full flex flex-col border border-zinc-800/60">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="edit-grad" gradientTransform="rotate(45)">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                      <path d="M20,80 Q50,20 80,80" stroke="url(#edit-grad)" strokeWidth="3" fill="none" />
                      <path d="M10,60 Q60,10 90,60" stroke="url(#edit-grad)" strokeWidth="2" fill="none" />
                      <circle cx="70" cy="30" r="8" stroke="url(#edit-grad)" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-500/20 transform transition-transform duration-300 group-hover:scale-110">
                        <Edit3 className="h-8 w-8 text-blue-400" />
                      </div>
                      
                      <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 border border-blue-500/30">
                        <ArrowRight className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">AI Image Editor</h3>
                    
                    <p className="text-zinc-400 mb-6 text-base leading-relaxed">
                      Enhance and transform your existing photos with precision. Upload any image and describe the changes you want - our AI will apply professional-grade edits instantly.
                    </p>
                  </div>
                  
                  <div className="relative z-10 mt-auto">
                    <div className="space-y-3">
                      <div className="flex items-center text-zinc-300 text-sm">
                        <Camera className="h-4 w-4 mr-3 text-blue-400" />
                        <span>Upload and edit existing photos</span>
                      </div>
                      <div className="flex items-center text-zinc-300 text-sm">
                        <Wand2 className="h-4 w-4 mr-3 text-blue-400" />
                        <span>Intelligent AI-powered modifications</span>
                      </div>
                      <div className="flex items-center text-zinc-300 text-sm">
                        <Sparkles className="h-4 w-4 mr-3 text-blue-400" />
                        <span>Professional enhancement tools</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who trust Imagen.ma for their visual content needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/text-to-image')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Creating Now
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/editor')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-zinc-800/80 border border-zinc-700 rounded-xl font-semibold text-zinc-200 hover:bg-zinc-700/80 transition-all duration-300"
              >
                Edit Your Photos
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img 
                src="/imagen.png"
                alt="Imagen.ma"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-lg font-bold mac-gradient-text">Imagen.ma</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-zinc-400">
              <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-indigo-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Imagen.ma. Professional AI-powered image generation and editing platform.
            </p>
            <p className="text-xs text-zinc-600 mt-2">
              Transform your creative vision with cutting-edge artificial intelligence technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;