/**
 * This module handles prompt enhancement using only the Mistral Small model via OpenRouter.
 * No Gemini fallback - Mistral can handle both image analysis and text enhancement.
 */

import { enhancePromptWithMistral } from './openRouterClient';

/**
 * Enhances a user prompt using Mistral Small model via OpenRouter
 * Mistral can handle both image analysis and text enhancement
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
    // Use Mistral for all prompt enhancements
    console.log('Enhancing prompt with Mistral Small...');
    const enhancedPrompt = await enhancePromptWithMistral(userPrompt, originalImage);
    return enhancedPrompt;
  } catch (error) {
    console.error('Mistral enhancement failed:', error);
    
    // Simple fallback if API fails - no Gemini fallback
    return `${userPrompt} with professional quality, enhanced detail, and optimal lighting`;
  }
}
