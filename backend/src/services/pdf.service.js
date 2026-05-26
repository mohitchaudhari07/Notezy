const { PDFParse } = require('pdf-parse');
const ApiError = require('../utils/ApiError');

class PdfService {
  /**
   * Extracts text from PDF file buffer
   * @param {Buffer} fileBuffer - PDF raw data buffer
   * @returns {Promise<String>} - Extracted text contents
   */
  async extractText(fileBuffer) {
    try {
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new ApiError(400, 'Invalid PDF buffer data.');
      }
      
      const pdf = new PDFParse({ data: fileBuffer });
      const parsedData = await pdf.getText();
      return parsedData.text || '';
    } catch (error) {
      console.error('❌ PDF Text Extraction Error:', error);
      throw new ApiError(500, `Failed to extract text from PDF: ${error.message}`);
    }
  }
}

module.exports = new PdfService();
