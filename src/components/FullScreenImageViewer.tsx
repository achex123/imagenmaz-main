import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Action {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface FullScreenImageViewerProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (() => void) | null;
  extraActions?: Action[];
  darkMode?: boolean;
}

const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = ({
  imageUrl,
  isOpen,
  onClose,
  onDownload = null,
  extraActions = [],
  darkMode = true
}) => {
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>();
  const touchStartRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') handleZoomIn();
      else if (e.key === '-') handleZoomOut();
      else if (e.key === '0') resetZoom();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen, onClose]);

  // Reset zoom level and position when opening a new image
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
    }
  }, [isOpen, imageUrl]);
  
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.25, 3)); // Max zoom 3x
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, 0.5); // Min zoom 0.5x
      // If we're going back to scale 1, reset position too
      if (newScale === 1 || newScale < 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);
  
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Handle mouse wheel for zooming
  const handleWheelNative = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + 0.1, 3)); // Zoom in
    } else {
      setScale(prev => {
        const newScale = Math.max(prev - 0.1, 0.5); // Zoom out
        if (newScale === 1 || newScale < 1) {
          setPosition({ x: 0, y: 0 }); // Reset position when back to normal size
        }
        return newScale;
      });
    }
  }, []);

  // Add wheel event listener with passive: false
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container || !isOpen) return;
    
    // Add wheel event listener with passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheelNative, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheelNative);
    };
  }, [handleWheelNative, isOpen]);

  // Optimized drag handling using requestAnimationFrame
  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;
    
    // Apply the transform directly to the image element for better performance
    if (imageRef.current) {
      imageRef.current.style.transform = `scale(${scale}) translate(${newX / scale}px, ${newY / scale}px)`;
    }
    
    // Store the position for when we stop dragging
    setPosition({ x: newX, y: newY });
    
    animationRef.current = requestAnimationFrame(() => {
      updatePosition(clientX, clientY);
    });
  }, [isDragging, dragStart, scale]);

  // Mouse drag handlers for panning when zoomed
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      
      // Start the animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(() => {
        updatePosition(e.clientX, e.clientY);
      });
    }
  }, [scale, position, updatePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      // The actual position update is handled by the animation frame
      // This just updates the target position
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(() => {
        updatePosition(e.clientX, e.clientY);
      });
    }
  }, [isDragging, scale, updatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Add non-passive touch event listeners
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container || !isOpen) return;

    const handleTouchStartManual = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Single touch for panning
        if (scale > 1) {
          setIsDragging(true);
          const touch = e.touches[0];
          setDragStart({ 
            x: touch.clientX - position.x, 
            y: touch.clientY - position.y 
          });
          touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        }
      } else if (e.touches.length === 2) {
        // Two finger pinch for zoom
        const dist = getDistance(
          e.touches[0].clientX, 
          e.touches[0].clientY, 
          e.touches[1].clientX, 
          e.touches[1].clientY
        );
        setTouchDistance(dist);
      }
    };

    const handleTouchMoveManual = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        // Handle panning
        const touch = e.touches[0];
        
        // Skip small movements to allow scrolling when intended
        const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
        
        // Only process significant movements 
        if (scale > 1 && (deltaX > 10 || deltaY > 10)) {
          const newX = touch.clientX - dragStart.x;
          const newY = touch.clientY - dragStart.y;
          
          // Apply the transform directly for smoother movement
          if (imageRef.current) {
            imageRef.current.style.transform = `scale(${scale}) translate(${newX / scale}px, ${newY / scale}px)`;
          }
          
          setPosition({ x: newX, y: newY });
        }
      } 
      else if (e.touches.length === 2 && touchDistance !== null) {
        // Handle pinch zoom
        const newDist = getDistance(
          e.touches[0].clientX, 
          e.touches[0].clientY, 
          e.touches[1].clientX, 
          e.touches[1].clientY
        );
        
        const deltaScale = newDist / touchDistance;
        const newScale = Math.min(Math.max(scale * deltaScale, 0.5), 3);
        
        setScale(newScale);
        setTouchDistance(newDist);
      }
    };

    const handleTouchEndManual = () => {
      setIsDragging(false);
      setTouchDistance(null);
    };

    // Add event listeners with passive: true
    container.addEventListener('touchstart', handleTouchStartManual, { passive: true });
    container.addEventListener('touchmove', handleTouchMoveManual, { passive: true });
    container.addEventListener('touchend', handleTouchEndManual, { passive: true });
    container.addEventListener('touchcancel', handleTouchEndManual, { passive: true });

    return () => {
      // Clean up
      container.removeEventListener('touchstart', handleTouchStartManual);
      container.removeEventListener('touchmove', handleTouchMoveManual);
      container.removeEventListener('touchend', handleTouchEndManual);
      container.removeEventListener('touchcancel', handleTouchEndManual);
    };
  }, [scale, position, dragStart, isDragging, touchDistance, isOpen]);

  // Stub React touch handlers
  const handleTouchStart = useCallback(() => {
    // Functionality moved to manual event listeners
  }, []);

  const handleTouchMove = useCallback(() => {
    // Functionality moved to manual event listeners
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Functionality moved to manual event listeners
  }, []);

  // Helper function to calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Add cursor class based on state
  const getCursorClass = () => {
    if (isLoading) return 'cursor-wait';
    if (isDragging) return 'cursor-grabbing';
    if (scale > 1) return 'cursor-grab';
    return 'cursor-zoom-in';
  };

  if (!isOpen) return null;
  
  // Create the fullscreen viewer content with macOS dark theme styling
  const fullscreenContent = (
    <div 
      className={cn(
        "fixed inset-0 z-[99999] flex flex-col justify-center items-center",
        "backdrop-blur-xl overscroll-none touch-none",
        darkMode ? "bg-black/95" : "bg-black/90"
      )}
      onClick={onClose}
      data-testid="fullscreen-viewer"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overscrollBehavior: 'none', touchAction: 'none' }}
    >
      {/* Top controls - with macOS styling */}
      <div className="absolute top-4 right-4 flex flex-wrap items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className={cn(
            "p-2.5 rounded-full transition-all",
            "backdrop-blur-md shadow-lg",
            darkMode 
              ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/90 border border-zinc-700/80"
              : "bg-black/30 text-white hover:bg-black/50"
          )}
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <div className={cn(
          "px-3.5 py-1.5 rounded-full text-sm font-medium backdrop-blur-md",
          darkMode 
            ? "bg-zinc-800/80 text-zinc-300 border border-zinc-700/80"
            : "bg-black/30 text-white"
        )}>
          {Math.round(scale * 100)}%
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className={cn(
            "p-2.5 rounded-full transition-all",
            "backdrop-blur-md shadow-lg",
            darkMode 
              ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/90 border border-zinc-700/80"
              : "bg-black/30 text-white hover:bg-black/50"
          )}
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetZoom();
          }}
          className={cn(
            "p-2.5 rounded-full transition-all",
            "backdrop-blur-md shadow-lg",
            darkMode 
              ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/90 border border-zinc-700/80"
              : "bg-black/30 text-white hover:bg-black/50"
          )}
          aria-label="Reset zoom"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        
        {extraActions.map((action, index) => (
          <button
            key={`extra-action-${index}`}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            className={cn(
              "p-2.5 rounded-full text-white transition-all shadow-lg backdrop-blur-md",
              action.className || (darkMode 
                ? "bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/50"
                : "bg-indigo-600/80 hover:bg-indigo-500"
              )
            )}
            aria-label={action.label}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
        
        {onDownload && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className={cn(
              "p-2.5 rounded-full text-white transition-all shadow-lg backdrop-blur-md",
              darkMode 
                ? "bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/50"
                : "bg-indigo-600/80 hover:bg-indigo-500"
            )}
            aria-label="Download image"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            "p-2.5 rounded-full transition-all",
            "backdrop-blur-md shadow-lg",
            darkMode 
              ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/90 border border-zinc-700/80"
              : "bg-black/30 text-white hover:bg-black/50"
          )}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "w-12 h-12 rounded-full animate-spin",
            darkMode 
              ? "border-4 border-indigo-800/60 border-t-indigo-500"
              : "border-4 border-primary/30 border-t-primary"
          )}></div>
        </div>
      )}
      
      {/* Image container with touch events */}
      <div 
        ref={imageContainerRef}
        className={`w-full h-full overflow-hidden flex justify-center items-center p-4 sm:p-8 ${getCursorClass()}`}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => {
          e.stopPropagation();
          resetZoom();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ touchAction: 'none', overscrollBehavior: 'none' }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Full screen preview"
          className={cn(
            "max-h-full max-w-full object-contain select-none will-change-transform",
            darkMode ? "filter-saturate-110" : ""
          )}
          style={{ 
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center',
            touchAction: 'none'
          }}
          onLoad={() => setIsLoading(false)}
          draggable={false}
        />
      </div>
      
      {/* Zoom instruction */}
      <div className={cn(
        "absolute bottom-6 left-1/2 transform -translate-x-1/2 py-1.5 px-4 rounded-full text-xs backdrop-blur-md",
        "transition-opacity duration-300",
        scale <= 1 ? "opacity-50" : "opacity-0",
        darkMode 
          ? "bg-zinc-800/70 text-zinc-400 border border-zinc-700/60"
          : "bg-black/30 text-white/70"
      )}>
        Double-tap or pinch to zoom
      </div>
    </div>
  );
  
  // Use portal to render outside the component hierarchy, directly into the document body
  return createPortal(fullscreenContent, document.body);
};

export default FullScreenImageViewer;
