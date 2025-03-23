import { toast } from 'sonner';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface TextToImageResponse {
  success: boolean;
  data: {
    imageUrl?: string;
    message?: string;
  }
}

/**
 * Generates an image from a text prompt using Gemini 2.0 Flash Experimental
 * 
 * @param prompt - The text prompt to generate an image from
 * @returns Response with generated image URL or error message
 */
export const generateImageFromText = async (prompt: string): Promise<TextToImageResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('API key is not configured. Please check your environment variables.');
    }
    
    // Show a toast notification to indicate the process has started
    const loadingToast = toast.loading('Generating image from your prompt...');

    // Use the correct endpoint and model for image generation
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`;
    
    // Fixed request body that follows the correct API format 
    // Removed invalid imageGenerationParams field
    const requestData = {
      contents: [{
        parts: [{
          text: prompt + " "
        }]
      }],
      generationConfig: {
        responseModalities: ["Text", "Image"],
        temperature: 0.4,
        topP: 0.95,
        topK: 32
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('Sending request to Gemini Image Generation API...');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    // Dismiss the loading toast
    toast.dismiss(loadingToast);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    console.log('API response received');
      
    // Access the response parts as shown in the example
    if (data.candidates && 
        data.candidates[0]?.content?.parts) {
        
      const parts = data.candidates[0].content.parts;
      
      // Process different part types as shown in the example
      let textParts = [];
      
      for (const part of parts) {
        if (part.text) {
          textParts.push(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          const imageUrl = `data:${mimeType};base64,${imageData}`;
          
          // Log the size of the generated image for debugging
          console.log(`Generated image data size: ~${Math.round(imageData.length * 0.75 / 1024)} KB`);
          
          return {
            success: true,
            data: {
              imageUrl,
              message: textParts.length > 0 ? textParts.join(" ") : "Image generated successfully"
            }
          };
        }
      }
      
      // If we only got text but no image
      if (textParts.length > 0) {
        return {
          success: false,
          data: {
            message: `No image was generated. The AI responded with: ${textParts.join(" ").substring(0, 100)}...`
          }
        };
      }
    }
    
    throw new Error('No valid content found in the response');
  } catch (error) {
    console.error('Error generating image:', error);
    
    let errorMessage = 'Failed to generate image';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    
    return {
      success: false,
      data: {
        message: errorMessage
      }
    };
  }
};
