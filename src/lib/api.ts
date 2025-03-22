
import { toast } from 'sonner';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL_NAME = 'gemini-2.0-flash-exp-image-generation';

interface GeminiApiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

interface GeminiResponse {
  success: boolean;
  data: {
    imageUrl?: string;
    message?: string;
  }
}

// Don't retry on authentication errors
const shouldRetry = (error: any): boolean => {
  if (error?.status === 401 || error?.code === 401) {
    return false;
  }
  return true;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || !shouldRetry(error)) throw error;
    await sleep(delay);
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};

const validateApiKey = (key: string | undefined): void => {
  if (!key) {
    throw new Error('Gemini API key is not configured. Please check your environment variables.');
  }
  if (key.length < 20) {
    throw new Error('Invalid API key format. Please check your API key.');
  }
};

export const processImageWithGemini = async (
  imageBase64: string,
  prompt: string
): Promise<GeminiResponse> => {
  try {
    validateApiKey(API_KEY);

    return await retryWithBackoff(async () => {
      const response = await fetch(`${API_BASE_URL}/gemini-2.0-flash-exp-image-generation:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Edit this image: ${prompt}`
            }, {
              inline_data: {
                mime_type: imageBase64.includes('image/png') ? 'image/png' : 'image/jpeg',
                data: imageBase64.split(',')[1]
              }
            }]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      });

      if (!response.ok) {
        const errorData: GeminiApiError = await response.json();
        const error = new Error(errorData.error?.message || 'API request failed');
        (error as any).status = response.status;
        (error as any).code = errorData.error?.code;
        throw error;
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('Invalid response from Gemini API');
      }
      
      // Process the response
      if (data.candidates && 
          data.candidates[0].content && 
          data.candidates[0].content.parts) {
          
          const parts = data.candidates[0].content.parts;
          let imageData = null;
          let textResponse = "";
          
          // Look for image data and text in response parts
          for (const part of parts) {
              if (part.inlineData || part.inline_data) {
                  imageData = part.inlineData || part.inline_data;
              } else if (part.text) {
                  textResponse += part.text;
              }
          }
          
          if (imageData) {
              const mimeType = imageData.mimeType || imageData.mime_type;
              const data = imageData.data;
              const imageUrl = `data:${mimeType};base64,${data}`;
              
              return {
                  success: true,
                  data: {
                      imageUrl,
                      message: "Image processed successfully with Gemini API"
                  }
              };
          } else if (textResponse) {
              return {
                  success: false,
                  data: {
                      message: textResponse
                  }
              };
          }
      }
      
      throw new Error('Invalid response format from Gemini API');
    });
  } catch (error) {
    console.error('Error processing image:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to process image';
    if ((error as any).status === 401) {
      errorMessage = 'Authentication failed. Please check your API key.';
    } else if ((error as any).status === 429) {
      errorMessage = 'API rate limit exceeded. Please try again later.';
    } else if ((error as any).status === 400) {
      errorMessage = 'Invalid request. The image may be too large or in an unsupported format.';
    } else if ((error as any).status === 500) {
      errorMessage = 'The Gemini API is currently experiencing issues. Please try again later.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    console.error('Detailed error:', error);
    toast.error(errorMessage);
    
    return {
      success: false,
      data: {
        message: errorMessage
      }
    };
  }
};
