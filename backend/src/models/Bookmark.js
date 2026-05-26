const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
);

// Ensure a user can only bookmark a specific resource once
bookmarkSchema.index({ user: 1, resource: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
