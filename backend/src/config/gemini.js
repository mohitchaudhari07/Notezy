const { GoogleGenAI } = require('@google/generative-ai');

// Check if Gemini API key exists
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ Warning: GEMINI_API_KEY is not defined in environment variables.');
}

// Initializing the Google Gen AI client
// Note: In @google/generative-ai, we can initialize GoogleGenAI or use GoogleGenAI directly
// Let's use the recommended initialization or import model helper
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

module.exports = {
  genAI,
  getGeminiModel: (modelName = 'gemini-3.5-flash') => {
    if (!genAI) {
      throw new Error('Google Generative AI is not initialized. Please check your GEMINI_API_KEY.');
    }
    return genAI.getGenerativeModel({ model: modelName });
  }
};
