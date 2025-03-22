/**
 * This module handles image analysis using Google's Gemini API
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Analyzes an image using Google's Gemini model and returns a detailed description
 * 
 * @param imageBase64 - Base64 encoded image data
 * @returns Detailed description of the image contents
 */
export async function analyzeImageWithGemini(imageBase64: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing');
  }

  // Extract the base64 data without the prefix
  const base64Data = imageBase64.split(',')[1];
  const mimeType = imageBase64.split(';')[0].split(':')[1];

  try {
    console.log("Analyzing image with Gemini API...");
    
    const response = await fetch(`${API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "You are an expert image analyst. Provide a detailed description of this image that captures all visual elements, style, composition, and subject matter. This description will be used as a prompt for a text-to-image AI to generate a similar image, so include specific details about: main subjects and their appearance, style and artistic qualities, composition and framing, lighting conditions, color scheme, and mood. Be thorough and descriptive, focusing purely on visual elements without including any explanations or notes. Write in present tense. Start with the main subject or theme, then describe style, details, and mood. Make it cohesive and clear - about 80-120 words that could recreate this image if used as a prompt."
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more focused descriptions
          topK: 32,
          topP: 0.9,
          maxOutputTokens: 400
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Image analysis error response:", errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    // Get the generated description and clean it up
    let description = data.candidates[0].content.parts[0].text;
    
    // Clean up the response to make it work better as a prompt
    description = description
      .trim()
      .replace(/^Description:?\s*/i, '')
      .replace(/^Prompt:?\s*/i, '')
      .replace(/^Image description:?\s*/i, '')
      .replace(/\n{2,}/g, ' ') // Replace multiple newlines with space
      .replace(/\*\*/g, '') // Remove markdown bold markers
      .replace(/\n/g, ' '); // Replace single newlines with space
      
    return description;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}
