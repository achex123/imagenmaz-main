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
 * 
 * @param prompt - The original prompt to enhance
 * @param originalImage - Optional base64 or URL of the original image to consider
 * @returns Enhanced prompt text
 */
export async function enhancePromptWithMistral(
  prompt: string,
  originalImage?: string
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new ApiKeyMissingError();
  }

  // Create a more sophisticated system prompt that instructs the model
  // to consider both the user's text and image context
  const systemPrompt = 
    'You are an expert image editing assistant similar to Midjourney. ' +
    'Your task is to enhance user prompts to make them more specific, detailed, and effective for AI image editors. ' +
    'The user will provide a basic edit request, and possibly an image. ' +
    'Your goal is to create a refined, professional prompt that addresses precisely what needs to be changed in the image, ' +
    'using language that AI image editors can effectively interpret. ' +
    '\n\n' +
    'Guidelines for prompt enhancement:' +
    '\n1. Focus on the user\'s intent - understand what they want to change' +
    '\n2. Add technical precision - use specific terms for styles, effects, lighting, etc.' +
    '\n3. Include relevant artistic direction - suggest aesthetic improvements' +
    '\n4. IMPORTANT: Never add elements that might not exist in the original image' +
    '\n5. Keep the enhanced prompt concise yet detailed (60-90 words max)' +
    '\n6. Use precise descriptive language that AI image models respond well to' +
    '\n7. Respond ONLY with the enhanced prompt, without explanations or comments';

  // Determine if we have image context and craft the user message accordingly
  let userMessage: string;
  if (originalImage && originalImage.length > 0) {
    // When we have image context, guide the model to consider it
    userMessage = 
      `I want to edit this specific image with the following request: "${prompt}".\n\n` +
      `Based on both my request and what's likely in the image, please enhance this prompt with specific, ` +
      `detailed editing directions while preserving the original intent. Consider potential visual elements ` +
      `like subjects, lighting, colors, and composition when refining the instruction.`;
  } else {
    // Without image context, focus on the prompt itself
    userMessage = 
      `I want to edit an image with this request: "${prompt}".\n\n` +
      `Please transform this basic request into a detailed, specific editing prompt that ` +
      `AI image editors would understand better. Add technical precision and artistic direction ` +
      `while keeping the original intent intact.`;
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
    temperature: 0.4,  // Slightly increased for more creative language
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
