/**
 * This module handles prompt enhancement using the Mistral Small model via OpenRouter.
 * As a fallback, it can use the Gemini API if OpenRouter fails.
 */

import { enhancePromptWithMistral } from './openRouterClient';
import { generateWithGemini } from './geminiClient';

/**
 * Enhances a user prompt using Mistral Small model via OpenRouter
 * Falls back to Gemini API if OpenRouter fails
 * 
 * @param userPrompt - The original prompt provided by the user
 * @param originalImage - Optional base64 of the original image to consider
 * @returns Enhanced prompt with more detail and clarity
 */
export async function enhancePrompt(
  userPrompt: string, 
  originalImage?: string
): Promise<string> {
  try {
    // First try with OpenRouter and Mistral model
    console.log('Enhancing prompt with Mistral Small...');
    const enhancedPrompt = await enhancePromptWithMistral(userPrompt, originalImage);
    return enhancedPrompt;
  } catch (error) {
    console.warn('OpenRouter API error, falling back to Gemini:', error);
    
    try {
      // Fall back to Gemini if OpenRouter fails
      console.log('Falling back to Gemini API...');
      return await generateWithGemini(userPrompt);
    } catch (secondError) {
      console.error('All API attempts failed:', secondError);
      
      // Simple fallback if all APIs fail
      return `${userPrompt} with professional quality, enhanced detail, and optimal lighting`;
    }
  }
}
