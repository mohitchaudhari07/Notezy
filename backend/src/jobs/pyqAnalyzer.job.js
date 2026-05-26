const Resource = require('../models/Resource');
const aiService = require('../services/ai.service');

const analyzePYQJob = async (resourceId) => {
  console.log(`\n⏳ [Job: PYQ Analyzer] Starting analysis for resource ID: ${resourceId}`);
  
  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      console.error(`❌[Job: PYQ Analyzer] Resource not found: ${resourceId}`);
      return;
    }
    
    resource.aiStatus = 'Processing';
    await resource.save();
    
    // Simulate text extraction and analysis process or call AI service
    // If it's a real PDF, we'd extract text via pdfService first
    // Since it's a simulated worker, we run it asynchronously:
    setTimeout(async () => {
      try {
        resource.aiStatus = 'Completed';
        await resource.save();
      } catch (error) {
        resource.aiStatus = 'Failed';
        resource.aiError = error.message;
        await resource.save();
      }
    }, 5000); // 5 seconds mock process delay
    
  } catch (error) {
    console.error(` [Job: PYQ Analyzer] Job initiation failed: ${error.message}`);
  }
};

module.exports = {
  analyzePYQJob
};
