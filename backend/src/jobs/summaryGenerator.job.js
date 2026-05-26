const Resource = require('../models/Resource');
const summaryService = require('../services/summary.service');

const queueSummaryGeneration = async (resourceId) => {
  console.log(`\n⏳ [Job: Summary Generator] Enqueued summary generation for resource: ${resourceId}`);
  
  // Asynchronous execution without awaiting inside HTTP response cycles
  setImmediate(async () => {
    try {
      let resource = await Resource.findById(resourceId);
      if (!resource) {
        const QuestionPaper = require('../models/QuestionPaper');
        const paper = await QuestionPaper.findById(resourceId);
        if (!paper) return;
        resource = {
          title: paper.branch === 'First Year' ? paper.pattern : paper.subject
        };
      }
      await summaryService.generateAndSaveSummary(resourceId);
    } catch (error) {
      console.error(` [Job: Summary Generator] Error in background job: ${error.message}`);
    }
  });
};

module.exports = {
  queueSummaryGeneration
};
