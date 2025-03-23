import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MacDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  maxWidth?: string;
}

const MacDialog: React.FC<MacDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "relative rounded-xl overflow-hidden shadow-2xl",
          "bg-zinc-900 border border-zinc-800/70",
          maxWidth,
          "w-full",
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* macOS-style window controls */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-800/70">
          <div className="flex space-x-2">
            <div 
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
              onClick={onClose}
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          
          {title && (
            <div className="flex-1 text-center text-sm font-medium text-zinc-300">
              {title}
            </div>
          )}
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MacDialog;
