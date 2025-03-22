/**
 * Gemini 1.5 Flash API client for text-to-text generation
 * This file handles communication with Google's Gemini API
 */

// Fetch API key from environment variables using Vite's import.meta.env
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Using Gemini 1.5 Flash model for faster response times
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Error to throw when API key is missing
class ApiKeyMissingError extends Error {
  constructor() {
    super('Gemini API key is missing. Please ensure VITE_GEMINI_API_KEY is set in your .env file.');
    this.name = 'ApiKeyMissingError';
  }
}

/**
 * Interface for the Gemini API request
 */
interface GeminiRequest {
  contents: {
    role: string;
    parts: {
      text: string;
    }[];
  }[];
  generationConfig: {
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
  };
}

/**
 * Simplified interface for Gemini API response
 */
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

/**
 * Generates a text response using Gemini 1.5 Flash
 * 
 * @param prompt - The user's prompt text to enhance
 * @returns The enhanced text from Gemini
 */
export async function generateWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new ApiKeyMissingError();
  }

  const url = `${API_ENDPOINT}?key=${GEMINI_API_KEY}`;

  const requestData: GeminiRequest = {
    contents: [
      {
        role: "user",
        parts: [
          { 
            text: `You are an expert in image editing prompts for AI. Your task is to enhance a prompt that describes edits to an existing image.

Important: Focus ONLY on enhancing the user's intended edit, not adding new elements that might not exist in the image. The AI will edit an existing photo based on this prompt, NOT generate a new image from scratch.

Original prompt: "${prompt}"

Please improve this prompt by:
1. Clarifying the specific edits requested (color adjustments, style changes, etc.)
2. Adding relevant technical details to improve the edit quality
3. Keeping the description focused on the original intent
4. Using precise, concise language (60-100 words)
5. NOT adding objects, people, or scenes that might not exist in the original photo

Enhanced edit prompt:` 
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3, // Lower temperature for more focused results
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 300,
    }
  };

  try {
    console.log("Calling Gemini 1.5 Flash API...");
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API response error:", errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    
    // Check if the response was blocked
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Prompt blocked: ${data.promptFeedback.blockReason}`);
    }
    
    // Extract the generated text
    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text.trim();
      return generatedText;
    }
    
    throw new Error('No text generated from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}
