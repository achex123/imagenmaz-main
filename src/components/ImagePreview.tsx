import React, { useState, useEffect } from 'react';
import { X, Download, RotateCw } from 'lucide-react';
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
      {/* Make the entire container clickable */}
      <div 
        className={cn(
          'relative rounded-lg overflow-hidden group',
          'cursor-zoom-in w-full h-full flex items-center justify-center', 
          'transition-transform hover:scale-[1.01]',
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
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
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
        
        {/* Overlay with actions */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300 flex items-end justify-between p-4'
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering full screen
              onRemove();
            }}
            className="p-2 text-white bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {isResult && onDownload && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering full screen
                  onDownload();
                }}
                className="p-2 text-white bg-primary/80 backdrop-blur-md rounded-full hover:bg-primary transition-colors"
                aria-label="Download image"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            
            {isResult && onContinueEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering full screen
                  onContinueEdit();
                }}
                className="p-2 text-white bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors"
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
