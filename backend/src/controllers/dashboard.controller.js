const Resource = require('../models/Resource');
const User = require('../models/User');
const Summary = require('../models/Summary');
const University = require('../models/University');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  
  if (userRole === 'student') {
    const Bookmark = require('../models/Bookmark');
    const DownloadHistory = require('../models/DownloadHistory');
    
    const [savedCount, downloadsCount] = await Promise.all([
      Bookmark.countDocuments({ user: userId }),
      DownloadHistory.countDocuments({ user: userId })
    ]);
    
    // Fetch recent downloads
    const recentDownloadsRaw = await DownloadHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentDownloads = [];
    for (let h of recentDownloadsRaw) {
      if (h.onModel === 'QuestionPaper') {
        const QuestionPaper = require('../models/QuestionPaper');
        const paper = await QuestionPaper.findById(h.resource);
        if (paper) {
          recentDownloads.push({
            _id: paper._id,
            id: paper._id,
            title: `${paper.examType || 'INSEM'} Exam (${paper.examYear}) - ${paper.branch === 'First Year' ? paper.pattern : paper.subject}`,
            type: 'PYQ',
            fileUrl: paper.pdfUrl,
            downloadedAt: h.createdAt
          });
        }
      } else {
        const populated = await DownloadHistory.findById(h._id).populate('resource', 'title fileUrl type');
        if (populated && populated.resource) {
          recentDownloads.push({
            _id: populated.resource._id,
            id: populated.resource._id,
            title: populated.resource.title,
            type: populated.resource.type,
            fileUrl: populated.resource.fileUrl,
            downloadedAt: h.createdAt
          });
        }
      }
    }
    
    // Fetch recent bookmarks
    const recentSavedRaw = await Bookmark.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentSaved = [];
    for (let b of recentSavedRaw) {
      if (b.onModel === 'QuestionPaper') {
        const QuestionPaper = require('../models/QuestionPaper');
        const paper = await QuestionPaper.findById(b.resource);
        if (paper) {
          recentSaved.push({
            _id: paper._id,
            id: paper._id,
            title: paper.branch === 'First Year' ? paper.pattern : paper.subject,
            type: 'PYQ',
            fileUrl: paper.pdfUrl,
            savedAt: b.createdAt
          });
        }
      } else {
        const populated = await Bookmark.findById(b._id).populate('resource', 'title fileUrl type');
        if (populated && populated.resource) {
          recentSaved.push({
            _id: populated.resource._id,
            id: populated.resource._id,
            title: populated.resource.title,
            type: populated.resource.type,
            fileUrl: populated.resource.fileUrl,
            savedAt: b.createdAt
          });
        }
      }
    }
    
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          role: 'student',
          overview: {
            savedCount,
            downloadsCount,
            totalResources: savedCount + downloadsCount
          },
          recentDownloads,
          recentSaved
        },
        'Student dashboard analytics retrieved successfully'
      )
    );
  }
  
  // Existing admin/moderator stats
  const [
    totalUsers,
    totalResources,
    totalSummaries,
    totalUniversities,
    pendingApprovals
  ] = await Promise.all([
    User.countDocuments({}),
    Resource.countDocuments({ isApproved: true }),
    Summary.countDocuments({}),
    University.countDocuments({ isActive: true }),
    Resource.countDocuments({ isApproved: false })
  ]);
  
  const countsAggregate = await Resource.aggregate([
    {
      $group: {
        _id: null,
        totalViews: { $sum: '$viewsCount' },
        totalDownloads: { $sum: '$downloadsCount' }
      }
    }
  ]);
  
  const totalViews = countsAggregate[0]?.totalViews || 0;
  const totalDownloads = countsAggregate[0]?.totalDownloads || 0;
  
  const recentResources = await Resource.find({ isApproved: true })
    .populate('subject', 'name')
    .populate('university', 'shortName')
    .sort({ createdAt: -1 })
    .limit(5);

  const stats = {
    role: userRole,
    overview: {
      totalUsers,
      totalResources,
      totalSummaries,
      totalUniversities,
      totalViews,
      totalDownloads,
      pendingApprovals
    },
    recentResources
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Dashboard analytics retrieved successfully'));
});

module.exports = {
  getDashboardStats
};
