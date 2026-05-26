const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const Resource = require('../models/Resource');
const DownloadHistory = require('../models/DownloadHistory');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const updateProfile = asyncHandler(async (req, res) => {
  const { name, university, branch } = req.body;
  
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');
  
  if (name) user.name = name;
  if (university) user.university = university;
  if (branch) user.branch = branch;
  
  await user.save();
  
  const updatedUser = await User.findById(user._id).select('-password -refreshToken');
  
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

const bookmarkResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.body;
  const userId = req.user._id;
  
  let onModel = 'Resource';
  let resource = await Resource.findById(resourceId);
  
  if (!resource) {
    const QuestionPaper = require('../models/QuestionPaper');
    resource = await QuestionPaper.findById(resourceId);
    if (resource) {
      onModel = 'QuestionPaper';
    }
  }
  
  if (!resource) throw new ApiError(404, 'Resource not found');
  
  const existingBookmark = await Bookmark.findOne({ user: userId, resource: resourceId });
  if (existingBookmark) {
    // If already exists, we toggle/remove it
    await Bookmark.deleteOne({ _id: existingBookmark._id });
    return res
      .status(200)
      .json(new ApiResponse(200, { bookmarked: false }, 'Resource removed from bookmarks'));
  }
  
  await Bookmark.create({ user: userId, resource: resourceId, onModel });
  
  return res
    .status(201)
    .json(new ApiResponse(201, { bookmarked: true }, 'Resource added to bookmarks'));
});

const getBookmarkedResources = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id });
  
  const populatedResources = [];
  
  for (let b of bookmarks) {
    if (b.onModel === 'QuestionPaper') {
      const QuestionPaper = require('../models/QuestionPaper');
      const paper = await QuestionPaper.findById(b.resource);
      if (paper) {
        populatedResources.push({
          _id: paper._id,
          id: paper._id,
          title: paper.branch === 'First Year' ? paper.pattern : paper.subject,
          type: 'PYQ',
          academicYear: paper.academicYear,
          year: paper.examYear,
          session: paper.session,
          examType: paper.examType,
          pattern: paper.pattern,
          fileUrl: paper.pdfUrl,
          subject: { name: paper.branch === 'First Year' ? paper.pattern : paper.subject },
          university: { shortName: paper.university },
          onModel: 'QuestionPaper'
        });
      }
    } else {
      const populated = await Bookmark.findById(b._id).populate({
        path: 'resource',
        populate: [
          { path: 'subject', select: 'name code' },
          { path: 'university', select: 'shortName' }
        ]
      });
      if (populated && populated.resource) {
        populatedResources.push({
          ...populated.resource.toObject(),
          id: populated.resource._id,
          onModel: 'Resource'
        });
      }
    }
  }
  
  return res
    .status(200)
    .json(new ApiResponse(200, populatedResources, 'Bookmarked resources retrieved successfully'));
});

const getDownloadHistory = asyncHandler(async (req, res) => {
  const history = await DownloadHistory.find({ user: req.user._id })
    .sort({ createdAt: -1 });
    
  const populatedHistory = [];
  
  for (let h of history) {
    if (h.onModel === 'QuestionPaper') {
      const QuestionPaper = require('../models/QuestionPaper');
      const paper = await QuestionPaper.findById(h.resource);
      if (paper) {
        populatedHistory.push({
          ...h.toObject(),
          resource: {
            _id: paper._id,
            id: paper._id,
            title: `${paper.examType || 'INSEM'} Exam (${paper.examYear}) - ${paper.branch === 'First Year' ? paper.pattern : paper.subject}`,
            type: 'PYQ',
            fileUrl: paper.pdfUrl,
            year: paper.examYear,
            session: paper.session,
            examType: paper.examType,
            pattern: paper.pattern
          }
        });
      }
    } else {
      const populated = await DownloadHistory.findById(h._id).populate({
        path: 'resource',
        select: 'title type fileUrl year'
      });
      if (populated && populated.resource) {
        populatedHistory.push(populated.toObject());
      }
    }
  }
    
  return res
    .status(200)
    .json(new ApiResponse(200, populatedHistory, 'Download history retrieved successfully'));
});

const recordDownload = asyncHandler(async (req, res) => {
  const { resourceId } = req.body;
  const userId = req.user._id;
  
  let onModel = 'Resource';
  let resource = await Resource.findById(resourceId);
  
  if (!resource) {
    const QuestionPaper = require('../models/QuestionPaper');
    resource = await QuestionPaper.findById(resourceId);
    if (resource) {
      onModel = 'QuestionPaper';
    }
  }
  
  if (!resource) throw new ApiError(404, 'Resource not found');
  
  // Record download history
  await DownloadHistory.create({
    user: userId,
    resource: resourceId,
    onModel,
    ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent']
  });
  
  // Increment download count
  if (onModel === 'Resource') {
    resource.downloadsCount = (resource.downloadsCount || 0) + 1;
    await resource.save();
  } else {
    const mongoose = require('mongoose');
    await mongoose.connection.db.collection('questionpapers').updateOne(
      { _id: resource._id },
      { $inc: { downloadsCount: 1 } }
    );
  }
  
  return res
    .status(201)
    .json(new ApiResponse(201, null, 'Download history recorded successfully'));
});

module.exports = {
  updateProfile,
  bookmarkResource,
  getBookmarkedResources,
  getDownloadHistory,
  recordDownload
};
