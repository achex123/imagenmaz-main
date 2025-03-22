/**
 * This module handles prompt enhancement using only the Mistral Small model via OpenRouter.
 * Works for both image editing and text-to-image prompt enhancement.
 */

import { enhancePromptWithMistral } from './openRouterClient';

/**
 * Enhances a user prompt using Mistral Small model via OpenRouter
 * Mistral can handle both image analysis and text enhancement
 * 
 * @param userPrompt - The original prompt provided by the user
 * @param originalImage - Optional base64 of the original image to consider
 * @param isEditing - Whether this is for image editing (true) or text-to-image (false)
 * @returns Enhanced prompt with more detail and clarity
 */
export async function enhancePrompt(
  userPrompt: string, 
  originalImage?: string,
  isEditing: boolean = true
): Promise<string> {
  try {
    // Use Mistral for all prompt enhancements
    console.log(`Enhancing ${isEditing ? 'edit' : 'generation'} prompt with Mistral Small...`);
    const enhancedPrompt = await enhancePromptWithMistral(userPrompt, originalImage, isEditing);
    return enhancedPrompt;
  } catch (error) {
    console.error('Mistral enhancement failed:', error);
    
    // Simple fallback if API fails - tailored to the use case
    if (isEditing) {
      return `${userPrompt} with professional quality, enhanced detail, and optimal lighting`;
    } else {
      return `${userPrompt}, highly detailed, professional photography, 8k, high resolution, sharp focus, dramatic lighting, vibrant colors`;
    }
  }
}
