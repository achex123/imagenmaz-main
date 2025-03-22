import React, { useState, useEffect } from 'react';
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
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onRemove,
  onContinueEdit,
  onDownload,
  isResult = false,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // For debugging
  useEffect(() => {
    console.log('ImagePreview isFullScreen:', isFullScreen);
  }, [isFullScreen]);
  
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Image clicked, opening fullscreen');
    setIsFullScreen(true);
  };
  
  return (
    <>
      {/* Make the entire container clickable with premium styling */}
      <div 
        className={cn(
          'relative rounded-lg overflow-hidden group',
          'cursor-zoom-in w-full h-full flex items-center justify-center', 
          'transition-all duration-300 hover:brightness-105',
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
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:400%_100%] rounded-lg" />
        )}
        
        <img
          src={imageUrl}
          alt="Preview"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'max-w-full max-h-full object-contain pointer-events-none filter-saturate-110',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
        />
        
        {/* Premium fullscreen indicator */}
        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full p-1.5 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-200 shadow-sm">
          <Maximize2 className="w-4 h-4" />
        </div>
        
        {/* Overlay with actions - improved with glass effect */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300 flex items-end justify-between p-4 backdrop-blur-[2px]'
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 text-white bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition-colors shadow-sm"
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
                className="p-2 text-white bg-primary shadow-sm backdrop-blur-md rounded-full hover:bg-primary/80 transition-colors"
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
                className="p-2 text-white bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition-colors shadow-sm"
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
      />
    </>
  );
};

export default ImagePreview;
