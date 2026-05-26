const Resource = require('../models/Resource');
const Summary = require('../models/Summary');
const pdfService = require('./pdf.service');
const aiService = require('./ai.service');
const ApiError = require('../utils/ApiError');
const axios = require('axios');

class SummaryService {
  /**
   * Orchestrates the complete pipeline of downloading resource PDF, extracting text, generating Gemini AI summary and saving to DB.
   * @param {String} resourceId - The Resource Mongo ID
   */
  async generateAndSaveSummary(resourceId) {
    const mongoose = require('mongoose');
    let resource = await Resource.findById(resourceId);
    let isQuestionPaper = false;
    
    if (!resource) {
      const QuestionPaper = require('../models/QuestionPaper');
      const paper = await QuestionPaper.findById(resourceId);
      if (!paper) {
        throw new ApiError(404, 'Document resource not found');
      }
      isQuestionPaper = true;
      resource = {
        _id: paper._id,
        fileUrl: paper.pdfUrl,
        type: 'PYQ',
        aiStatus: 'Pending',
        aiError: '',
        save: async () => {
          await mongoose.connection.db.collection('questionpapers').updateOne(
            { _id: paper._id },
            { 
              $set: { 
                aiStatus: resource.aiStatus,
                aiError: resource.aiError
              } 
            }
          );
        }
      };
    }
    
    // Update status to Processing
    resource.aiStatus = 'Processing';
    await resource.save();
    
    try {
      console.log(`\n🔹 [Summary Service] Downloading PDF file from URL: ${resource.fileUrl}`);
      // Fetch file buffer from secure Cloudinary url
      const fileResponse = await axios.get(resource.fileUrl, { responseType: 'arraybuffer' });
      const fileBuffer = Buffer.from(fileResponse.data);
      
      console.log(`\n🔹 [Summary Service] Parsing PDF text contents...`);
      const extractedText = await pdfService.extractText(fileBuffer);
      
      if (!extractedText.trim()) {
        throw new Error('Extracted PDF text is empty or unscannable.');
      }
      
      console.log(`\n🔹 [Summary Service] Invoking Gemini AI model analysis...`);
      const analysisResult = await aiService.generateSummary(extractedText, resource.type);
      
      // Delete any pre-existing summary for this resource to avoid duplicates
      await Summary.deleteOne({ resource: resource._id });
      
      // Save new summary
      const savedSummary = await Summary.create({
        resource: resource._id,
        summaryText: analysisResult.summaryText,
        keyTakeaways: analysisResult.keyTakeaways || [],
        chapters: analysisResult.chapters || [],
        keyFormulas: analysisResult.keyFormulas || []
      });
      
      // Update resource status to Completed
      resource.aiStatus = 'Completed';
      await resource.save();
      
      return savedSummary;
    } catch (error) {
      console.error(`❌ [Summary Service] Pipeline failed for resource ${resourceId}:`, error);
      
      resource.aiStatus = 'Failed';
      resource.aiError = error.message;
      await resource.save();
      
      throw new ApiError(500, `AI Pipeline failed: ${error.message}`);
    }
  }

  /**
   * Retrieves an existing summary for a resource
   */
  async getSummaryByResourceId(resourceId) {
    const summary = await Summary.findOne({ resource: resourceId });
    if (!summary) {
      throw new ApiError(404, 'Summary not found for this resource yet. Try triggering generation.');
    }
    return summary;
  }
}

module.exports = new SummaryService();
