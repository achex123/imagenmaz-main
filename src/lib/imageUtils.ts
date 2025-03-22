/**
 * Converts a File object to a base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Downloads an image from a URL or base64 string
 */
export const downloadImage = (imageSource: string, filename = 'edited-image.jpg') => {
  const link = document.createElement('a');
  link.href = imageSource;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Adds blur effect to a loading image
 */
export const addLoadingEffect = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageUrl);
        return;
      }
      
      // Apply a blur effect
      ctx.filter = 'blur(10px) brightness(0.8)';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => resolve(imageUrl);
  });
};

/**
 * Get combined count of image edits
 */
export const getUsageCount = (): number => {
  const editCount = localStorage.getItem('gemini-edit-count');
  return editCount ? parseInt(editCount, 10) : 0;
};

/**
 * Get count of text-to-image generations
 */
export const getGenCount = (): number => {
  const genCount = localStorage.getItem('gemini-gen-count');
  return genCount ? parseInt(genCount, 10) : 0;
};

/**
 * Get total usage count (edits + generations)
 */
export const getTotalUsageCount = (): number => {
  return getUsageCount() + getGenCount();
};

/**
 * Increment edit count in localStorage
 */
export const incrementUsageCount = (): number => {
  const currentCount = getUsageCount();
  const newCount = currentCount + 1;
  localStorage.setItem('gemini-edit-count', newCount.toString());
  return newCount;
};

/**
 * Increment generation count in localStorage
 */
export const incrementGenCount = (): number => {
  const currentCount = getGenCount();
  const newCount = currentCount + 1;
  localStorage.setItem('gemini-gen-count', newCount.toString());
  return newCount;
};
