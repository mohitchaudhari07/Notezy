const summaryService = require('../services/summary.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Resource = require('../models/Resource');
const { queueSummaryGeneration } = require('../jobs/summaryGenerator.job');

const generateSummary = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  
  let resource = await Resource.findById(resourceId);
  if (!resource) {
    const QuestionPaper = require('../models/QuestionPaper');
    resource = await QuestionPaper.findById(resourceId);
  }
  
  if (!resource) {
    throw new ApiError(404, 'Document resource not found');
  }
  
  console.log(`\n🔹 [Controller] Manual trigger for AI Summary. Resource: ${resourceId}`);
  
  // Since pipeline takes 10-30s depending on Gemini / file size, we queue it
  // and return 202 Accepted status
  await queueSummaryGeneration(resourceId);
  
  return res
    .status(202)
    .json(new ApiResponse(202, { aiStatus: 'Processing' }, 'AI summary pipeline enqueued successfully'));
});

const getSummary = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  
  const summary = await summaryService.getSummaryByResourceId(resourceId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, summary, 'Resource summary retrieved successfully'));
});

module.exports = {
  generateSummary,
  getSummary
};
