/**
 * This module handles prompt enhancement using Gemini 2.0 Flash AI.
 * It directly connects to Google's Gemini API for text-to-text generation.
 */

import { generateWithGemini } from './geminiClient';

/**
 * Enhances a user prompt using Google's Gemini 2.0 Flash AI
 * 
 * @param userPrompt - The original prompt provided by the user
 * @returns Enhanced prompt with more detail and clarity
 */
export async function enhancePrompt(userPrompt: string): Promise<string> {
  try {
    // Use the Gemini API to enhance the prompt
    const enhancedPrompt = await generateWithGemini(userPrompt);
    return enhancedPrompt;
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Simple fallback if API fails - return original with minimal enhancement
    return `${userPrompt} with professional quality, enhanced detail, and optimal lighting`;
  }
}
