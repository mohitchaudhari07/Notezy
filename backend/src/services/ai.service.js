const { getGeminiModel } = require('../config/gemini');
const ApiError = require('../utils/ApiError');

class AiService {
  /**
   * Generates a structured JSON analysis and summary of a study resource (like PYQs)
   * @param {String} documentText - The text content extracted from the document
   * @param {String} resourceType - PYQ, Notes, or Syllabus
   */
  async generateSummary(documentText, resourceType = 'PYQ') {
    try {
      const model = getGeminiModel('gemini-3.5-flash');
      
      const prompt = `
        You are an expert university academic assistant and tutor. Your task is to analyze the following extracted text from a ${resourceType} document and produce a highly structured, accurate, and premium study guide summary.
        
        The document contains university exam questions, notes, or syllabus guidelines.
        
        Please return a strictly formatted JSON object with the following schema:
        {
          "summaryText": "A comprehensive 3-paragraph summary of the document, explaining its general focus, level of difficulty, and major subjects covered.",
          "keyTakeaways": [
            "Bullet point 1 detailing a critical concept or frequently asked theme.",
            "Bullet point 2 detailing another important focus area.",
            "Bullet point 3 detailing recommendations on what students must focus on."
          ],
          "chapters": [
            {
              "title": "Chapter or Topic Name (e.g. Dynamic Programming, Linear Algebra)",
              "topics": ["Sub-topic 1", "Sub-topic 2"],
              "importance": "High" (must be "High", "Medium", or "Low")
            }
          ],
          "keyFormulas": [
            {
              "formula": "The mathematical or technical formula (e.g., E = mc^2, Big-O complexity)",
              "description": "Explanation of the formula variables and how it is applied in this context"
            }
          ]
        }
        
        Do NOT write any pre-amble, markdown fences, or conversational text. Return ONLY the raw JSON string matching the specified schema.
        
        Extracted Document Text:
        ---
        ${documentText.substring(0, 15000)} // Limit to first 15000 chars to fit standard context limits safely
        ---
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response.text().trim();
      
      // Clean up potential markdown fences wrapped by the LLM
      const cleanJson = jsonText
        .replace(/^```json/i, '')
        .replace(/^```/, '')
        .replace(/```$/, '')
        .trim();
        
      try {
        return JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('❌ Failed to parse Gemini response as JSON. Raw response:', cleanJson);
        // Fallback structure
        return {
          summaryText: "Failed to parse structured summary. Raw output: " + cleanJson.substring(0, 500),
          keyTakeaways: ["Failed to extract structured takeaways"],
          chapters: [],
          keyFormulas: []
        };
      }
    } catch (error) {
      console.error('❌ Google Gemini Service Error:', error);
      throw new ApiError(500, `Gemini summary generation failed: ${error.message}`);
    }
  }
}

module.exports = new AiService();
