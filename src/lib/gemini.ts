import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_FLASH_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API key in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
}