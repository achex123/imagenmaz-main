import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DragDropUploadProps {
  onImageSelected: (file: File) => void;
  className?: string;
  darkMode?: boolean;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({ 
  onImageSelected,
  className,
  darkMode = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
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
      if (validateFile(file)) {
        onImageSelected(file);
      }
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onImageSelected(file);
      }
    }
  };
  
  const validateFile = (file: File) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return false;
    }
    
    // Check if the file size is less than 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return false;
    }
    
    return true;
  };
  
  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center w-full p-8 sm:p-10 transition-all duration-300 border-2 border-dashed rounded-xl cursor-pointer",
        darkMode
          ? isDragging 
              ? "border-indigo-500/70 bg-indigo-900/20 scale-[1.02] shadow-lg" 
              : "border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800/50 shadow-md"
          : isDragging 
              ? "border-primary bg-primary/5 scale-[1.02] shadow-lg" 
              : "border-gray-200 hover:border-primary/40 hover:bg-gray-50/70 shadow-sm",
        className
      )}
    >
      {/* Background gradient for a premium feel */}
      <div className={cn(
        "absolute inset-0 opacity-70",
        darkMode
          ? "bg-gradient-to-b from-transparent to-indigo-950/10"
          : "bg-gradient-to-b from-transparent to-blue-50/30"
      )}></div>
      
      <div className="flex flex-col items-center justify-center gap-4 text-center z-10">
        <div className={cn(
          'h-14 w-14 rounded-full flex items-center justify-center',
          'transition-all duration-500',
          darkMode
            ? isDragging 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 scale-110 shadow-lg' 
                : 'bg-gradient-to-br from-indigo-600/80 to-purple-700/80 scale-100 shadow-md border border-indigo-500/30'
            : isDragging 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 scale-110 shadow-lg' 
                : 'bg-gradient-to-br from-blue-400 to-blue-500 scale-100 shadow-md'
        )}>
          <CloudUpload className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className={cn(
            "mb-1 text-lg font-medium",
            darkMode ? "text-zinc-200" : "text-gray-800"
          )}>
            Drag and drop your image here
          </p>
          <p className={cn(
            "text-sm",
            darkMode ? "text-zinc-500" : "text-gray-500"
          )}>
            Supports JPG, PNG and GIF up to 10MB
          </p>
        </div>
        <div className="relative mt-1">
          <div className={cn(
            'px-5 py-2.5 text-sm text-white rounded-lg',
            'transition-all duration-300 font-medium shadow flex items-center gap-2',
            darkMode
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-indigo-500/30'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          )}>
            <ImageIcon className="w-4 h-4" />
            <span>Select an image</span>
          </div>
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

export default DragDropUpload;
