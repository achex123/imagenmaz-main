
import { useState, useCallback } from 'react';
import { processImageWithGemini } from '@/lib/api';
import { fileToBase64, incrementUsageCount } from '@/lib/imageUtils';
import { toast } from 'sonner';

interface EditorState {
  originalImage: string | null;
  resultImage: string | null;
  prompt: string;
  isLoading: boolean;
  originalFile: File | null;
}

export const useImageEditor = () => {
  const [state, setState] = useState<EditorState>({
    originalImage: null,
    resultImage: null,
    prompt: '',
    isLoading: false,
    originalFile: null
  });
  
  // Handle image selection
  const handleImageSelected = useCallback(async (file: File) => {
    try {
      const imageBase64 = await fileToBase64(file);
      setState(prev => ({
        ...prev,
        originalImage: imageBase64,
        resultImage: null,
        originalFile: file
      }));
    } catch (error) {
      console.error('Error converting file to base64:', error);
      toast.error('Error loading image. Please try again.');
    }
  }, []);
  
  // Remove current image
  const removeImage = useCallback(() => {
    setState(prev => ({
      ...prev,
      originalImage: null,
      resultImage: null,
      originalFile: null
    }));
  }, []);
  
  // Process image with prompt
  const processImage = useCallback(async (prompt: string) => {
    if (!state.originalImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, prompt }));
    
    try {
      const result = await processImageWithGemini(state.originalImage, prompt);
      
      if (result.success && result.data.imageUrl) {
        setState(prev => ({
          ...prev,
          resultImage: result.data.imageUrl,
          isLoading: false
        }));
        
        // Increment usage count
        incrementUsageCount();
        
        toast.success('Image edited successfully!');
      } else {
        throw new Error(result.data.message || 'Failed to process image');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to edit image. Please try again.');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.originalImage]);
  
  // Continue editing with the result image
  const continueEditing = useCallback(() => {
    if (!state.resultImage) return;
    
    setState(prev => ({
      ...prev,
      originalImage: prev.resultImage,
      resultImage: null
    }));
  }, [state.resultImage]);
  
  // Reset the editor
  const resetEditor = useCallback(() => {
    setState({
      originalImage: null,
      resultImage: null,
      prompt: '',
      isLoading: false,
      originalFile: null
    });
  }, []);
  
  return {
    ...state,
    handleImageSelected,
    removeImage,
    processImage,
    continueEditing,
    resetEditor
  };
};
