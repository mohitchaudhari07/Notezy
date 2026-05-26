const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Resource is required'],
      refPath: 'onModel'
    },
    onModel: {
      type: String,
      required: true,
      enum: ['Resource', 'QuestionPaper'],
      default: 'Resource'
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create index on user and resource for historical tracking queries
downloadHistorySchema.index({ user: 1, createdAt: -1 });

const DownloadHistory = mongoose.model('DownloadHistory', downloadHistorySchema);

module.exports = DownloadHistory;
