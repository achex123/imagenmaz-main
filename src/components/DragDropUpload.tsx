
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
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
        'relative flex flex-col items-center justify-center w-full p-12 transition-all duration-300 border-2 border-dashed rounded-lg cursor-pointer',
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.01]' 
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className={cn(
          'h-12 w-12 rounded-full flex items-center justify-center bg-primary/10',
          'transition-transform duration-500',
          isDragging ? 'scale-110' : 'scale-100'
        )}>
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="mb-1 text-lg font-medium">Drag and drop your image here</p>
          <p className="text-sm text-muted-foreground">Supports JPG, PNG and GIF up to 10MB</p>
        </div>
        <div className="relative mt-4">
          <div className={cn(
            'px-4 py-2 text-sm text-primary border border-primary/20 rounded-lg',
            'transition-all duration-300 hover:bg-primary/5',
            'flex items-center gap-2'
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
