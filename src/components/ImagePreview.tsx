import React, { useState } from 'react';
import { X, Download, RotateCw, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import FullScreenImageViewer from './FullScreenImageViewer';

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
  onContinueEdit?: () => void;
  onDownload?: () => void;
  isResult?: boolean;
  className?: string;
  darkMode?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onRemove,
  onContinueEdit,
  onDownload,
  isResult = false,
  className,
  darkMode = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullScreen(true);
  };
  
  return (
    <>
      {/* Make the entire container clickable with macOS styling */}
      <div 
        className={cn(
          'relative rounded-xl overflow-hidden group',
          'cursor-zoom-in w-full h-full flex items-center justify-center', 
          'transition-all duration-300 hover:brightness-105',
          darkMode ? 'bg-zinc-800 border border-zinc-700/60' : 'bg-gray-100/70 shadow-md',
          className
        )}
        onClick={handleImageClick}
        role="button"
        aria-label="View image in full screen"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsFullScreen(true);
          }
        }}
        data-testid="image-preview-container"
      >
        {/* Loading skeleton with shimmer effect */}
        {!isLoaded && (
          <div className={cn(
            "absolute inset-0 animate-shimmer bg-[length:400%_100%] rounded-lg",
            darkMode 
              ? "bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800" 
              : "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          )} />
        )}
        
        <img
          src={imageUrl}
          alt="Preview"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'max-w-full max-h-full object-contain pointer-events-none',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
        />
        
        {/* Premium fullscreen indicator */}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md rounded-full p-1.5 text-white/90 opacity-0 group-hover:opacity-80 transition-opacity duration-200 shadow-sm border border-white/10">
          <Maximize2 className="w-4 h-4" />
        </div>
        
        {/* Overlay with actions - improved with glass effect */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300 flex items-end justify-between p-4 backdrop-blur-[2px]'
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 text-white/90 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors shadow-sm border border-white/10"
            aria-label="Remove image"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {isResult && onDownload && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="p-2 text-white/90 bg-indigo-600/80 backdrop-blur-md rounded-full hover:bg-indigo-500 transition-colors shadow-md border border-indigo-500/50"
                aria-label="Download image"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            
            {isResult && onContinueEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onContinueEdit();
                }}
                className="p-2 text-white/90 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors shadow-sm border border-white/10"
                aria-label="Continue editing"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Full screen image viewer with higher z-index */}
      <FullScreenImageViewer
        imageUrl={imageUrl}
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        onDownload={onDownload}
        darkMode={darkMode}
      />
    </>
  );
};

export default ImagePreview;
