import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DragDropUploadProps {
  onImageSelected: (file: File) => void;
  className?: string;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({ 
  onImageSelected,
  className
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
        'relative flex flex-col items-center justify-center w-full p-8 sm:p-12 transition-all duration-300 border-2 border-dashed rounded-lg cursor-pointer',
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg' 
          : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50/70 shadow-sm',
        className
      )}
    >
      {/* Background gradient for a premium feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/30 opacity-70"></div>
      
      <div className="flex flex-col items-center justify-center gap-4 text-center z-10">
        <div className={cn(
          'h-14 w-14 rounded-full flex items-center justify-center',
          'transition-all duration-500 bg-gradient-to-br',
          isDragging 
            ? 'from-blue-500 to-indigo-600 scale-110 shadow-lg' 
            : 'from-blue-400 to-blue-500 scale-100 shadow-md'
        )}>
          <CloudUpload className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="mb-1 text-lg font-medium">Drag and drop your image here</p>
          <p className="text-sm text-gray-500">Supports JPG, PNG and GIF up to 10MB</p>
        </div>
        <div className="relative mt-2">
          <div className={cn(
            'px-5 py-2.5 text-sm text-white rounded-lg',
            'transition-all duration-300 font-medium',
            'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            'shadow-sm hover:shadow flex items-center gap-2'
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
