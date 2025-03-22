import React, { useState, useRef } from 'react';
import { Camera, Loader2, X, Sparkles, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fileToBase64 } from '@/lib/imageUtils';
import { analyzeImageWithGemini } from '@/lib/imageAnalysis';
import { toast } from 'sonner';

interface ImageAnalysisUploaderProps {
  onAnalysisComplete: (imageUrl: string, description: string) => void;
  className?: string;
}

const ImageAnalysisUploader: React.FC<ImageAnalysisUploaderProps> = ({ 
  onAnalysisComplete,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleImageFile(file);
    }
  };
  
  const handleImageFile = async (file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit (increased from 4MB)
        toast.error('Image size should be less than 10MB');
        return;
      }
      
      const imageBase64 = await fileToBase64(file);
      setUploadedImage(imageBase64);
      
      // Don't auto-analyze, wait for user to click the button
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };
  
  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    const loadingToastId = toast.loading('Analyzing image with Gemini...');
    
    try {
      const description = await analyzeImageWithGemini(uploadedImage);
      
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);
      
      // Pass both the image and description back
      onAnalysisComplete(uploadedImage, description);
      toast.success('Image analyzed successfully');
      
      // Clear the uploaded image
      setUploadedImage(null);
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);
      
      // Show a more user-friendly error message
      if (error instanceof Error && error.message.includes('API error')) {
        toast.error('Gemini API unavailable', {
          description: 'Please check your API key or try again later'
        });
      } else {
        toast.error('Failed to analyze image', {
          description: 'Please check your connection and try again'
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleCancel = () => {
    setUploadedImage(null);
  };
  
  if (uploadedImage) {
    return (
      <div className={cn("w-full rounded-lg overflow-hidden", className)}>
        <div className="relative">
          <img 
            src={uploadedImage}
            alt="Preview" 
            className="w-full h-auto max-h-[200px] object-contain bg-gray-100 rounded-t-lg"
          />
          
          <button
            onClick={handleCancel}
            className="absolute top-2 right-2 p-1.5 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
            disabled={isAnalyzing}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-b-lg border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Use AI to analyze this image</p>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                "transition-all duration-200",
                isAnalyzing 
                  ? "bg-indigo-100 text-indigo-500 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate from Image</span>
                </>
              )}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            The AI will analyze this image and create a description to generate a similar image
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300",
        isDragging 
          ? "border-purple-400 bg-purple-50 scale-[1.01]"
          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50/70",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="p-3 bg-purple-100 rounded-full mb-3">
          <Camera className="w-5 h-5 text-purple-600" />
        </div>
        <p className="text-sm font-medium mb-1">Upload an image for inspiration</p>
        <p className="text-xs text-gray-500 mb-3">AI will analyze it and create a similar image</p>
        
        <div className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs text-gray-700 font-medium transition-colors">
          Select Image
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageAnalysisUploader;
