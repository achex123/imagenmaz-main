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
  const handleImageSelected = useCallback(async (fileOrBase64: File | string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      let base64Image: string;
      
      // Check if the input is already a base64 string
      if (typeof fileOrBase64 === 'string') {
        base64Image = fileOrBase64;
      } else {
        // Convert File to base64
        base64Image = await fileToBase64(fileOrBase64);
      }
      
      setState(prev => ({
        ...prev,
        originalImage: base64Image,
        resultImage: null,
        originalFile: typeof fileOrBase64 === 'string' ? null : fileOrBase64
      }));
    } catch (error) {
      console.error('Error loading image:', error);
      toast.error('Failed to load image. Please try again.');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
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
