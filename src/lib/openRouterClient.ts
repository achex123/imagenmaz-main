/**
 * OpenRouter API client for accessing the Mistral Small model
 * This file handles communication with OpenRouter's API
 */

// Fetch API key from environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'mistralai/mistral-small-3.1-24b-instruct:free';

// Error to throw when API key is missing
class ApiKeyMissingError extends Error {
  constructor() {
    super('OpenRouter API key is missing. Please ensure VITE_OPENROUTER_API_KEY is set in your .env file.');
    this.name = 'ApiKeyMissingError';
  }
}

/**
 * Interface for OpenRouter API request
 */
interface OpenRouterRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature: number;
  max_tokens: number;
}

/**
 * Interface for OpenRouter API response
 */
interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

/**
 * Enhances a prompt using Mistral Small model with image context awareness
 * Works for both image editing and text-to-image generation
 * 
 * @param prompt - The original prompt to enhance
 * @param originalImage - Optional base64 or URL of the original image to consider
 * @param isEditing - Whether this is for image editing (true) or text-to-image (false)
 * @returns Enhanced prompt text
 */
export async function enhancePromptWithMistral(
  prompt: string,
  originalImage?: string,
  isEditing: boolean = true
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new ApiKeyMissingError();
  }

  // Create system prompts specific to the use case
  const systemPromptImageEditor = 
    'You are an expert image editing assistant similar to Midjourney. ' +
    'Your task is to enhance user prompts for AI image editors that modify existing images. ' +
    'The user will provide a basic edit request, and possibly an image context. ' +
    'Your goal is to create a refined, professional prompt that addresses precisely what needs to be changed ' +
    'using language that AI image editors can effectively interpret. ' +
    '\n\n' +
    'Guidelines for prompt enhancement:' +
    '\n1. Focus on the user\'s intent - understand what they want to change' +
    '\n2. Add technical precision - use specific terms for styles, effects, lighting, etc.' +
    '\n3. Include relevant artistic direction - suggest aesthetic improvements' +
    '\n4. IMPORTANT: Never add elements that might not exist in the original image' +
    '\n5. Keep the enhanced prompt concise yet detailed (60-90 words max)' +
    '\n6. Use precise descriptive language that AI image editors respond well to' +
    '\n7. Respond ONLY with the enhanced prompt, without explanations or comments';

  const systemPromptTextToImage = 
    'You are an expert text-to-image prompt engineer. ' +
    'Your task is to enhance user prompts for AI image generation from scratch (not editing). ' +
    'The user will provide a basic description of what they want to create. ' +
    'Your goal is to transform this into a high-quality prompt that will produce beautiful, detailed images. ' +
    '\n\n' +
    'Guidelines for prompt enhancement:' +
    '\n1. Expand on the user\'s vision with rich visual details' +
    '\n2. Add specific artistic direction - style, mood, lighting, composition' +
    '\n3. Include technical elements like camera angle, lens type, rendering style' +
    '\n4. Maintain the user\'s core concept while adding depth and clarity' +
    '\n5. Keep the enhanced prompt concise yet detailed (60-100 words max)' +
    '\n6. Use descriptive language that AI image generators respond well to' +
    '\n7. Respond ONLY with the enhanced prompt, without explanations or comments';

  // Select the appropriate system prompt based on the use case
  const systemPrompt = isEditing ? systemPromptImageEditor : systemPromptTextToImage;

  // Determine if we have image context and craft the user message accordingly
  let userMessage: string;
  if (isEditing && originalImage && originalImage.length > 0) {
    // For image editing with image context
    userMessage = 
      `I want to edit this specific image with the following request: "${prompt}".\n\n` +
      `Based on both my request and what's likely in the image, please enhance this prompt with specific, ` +
      `detailed editing directions while preserving the original intent. Consider potential visual elements ` +
      `like subjects, lighting, colors, and composition when refining the instruction.`;
  } else if (isEditing) {
    // For image editing without image context
    userMessage = 
      `I want to edit an image with this request: "${prompt}".\n\n` +
      `Please transform this basic request into a detailed, specific editing prompt that ` +
      `AI image editors would understand better. Add technical precision and artistic direction ` +
      `while keeping the original intent intact.`;
  } else {
    // For text-to-image generation
    userMessage = 
      `I want to generate a new image with this description: "${prompt}".\n\n` +
      `Please enhance this description into a detailed, high-quality prompt that will create ` +
      `an impressive image when fed to an AI text-to-image generator. Add details about style, ` +
      `mood, lighting, perspective, and other elements that will result in a beautiful image.`;
  }

  // Create the request data with more nuanced parameters
  const requestData: OpenRouterRequest = {
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: isEditing ? 0.3 : 0.5,  // Higher temperature for creative text-to-image prompts
    max_tokens: 250    // Limited to ensure concise responses
  };

  try {
    console.log(`Calling OpenRouter API with Mistral model for enhanced prompt...`);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://imagen.ma',
        'X-Title': 'Imagen.ma'
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error response:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json() as OpenRouterResponse;
    
    if (data.error) {
      throw new Error(`OpenRouter API error: ${data.error.message}`);
    }
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from OpenRouter API');
    }

    // Enhanced cleaning of AI response
    const enhancedPrompt = data.choices[0].message.content.trim();
    
    // More thorough cleanup of common AI response patterns
    return enhancedPrompt
      .replace(/^["']|["']$/g, '')  // Remove surrounding quotes
      .replace(/^Enhanced prompt:?\s*/i, '')
      .replace(/^Here's an enhanced version:?\s*/i, '')
      .replace(/^Here's a refined prompt:?\s*/i, '')
      .replace(/^Enhanced editing prompt:?\s*/i, '')
      .replace(/\n*I hope this helps!.*$/i, '')  // Remove closing remarks
      .replace(/\n*Let me know if.*$/i, '')      // Remove follow-up offers
      .trim();
    
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}
