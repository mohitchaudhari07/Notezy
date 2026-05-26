const mongoose = require('mongoose');
const { RESOURCE_TYPES, EXAM_TYPES, SEMESTERS } = require('../utils/constants');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(RESOURCE_TYPES),
      required: [true, 'Resource type is required (e.g., PYQ, Notes, Syllabus)']
    },
    examType: {
      type: String,
      enum: Object.values(EXAM_TYPES),
      default: EXAM_TYPES.OTHER
    },
    year: {
      type: Number,
      required: [true, 'Academic year is required (e.g., 2024)']
    },
    semester: {
      type: Number,
      enum: Object.values(SEMESTERS),
      required: [true, 'Semester is required (1 to 8)']
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required']
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Branch is required']
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University is required']
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required']
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required']
    },
    fileSize: {
      type: Number, // In bytes
      default: 0
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required']
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    downloadsCount: {
      type: Number,
      default: 0
    },
    aiStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed'],
      default: 'Pending'
    },
    aiError: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
resourceSchema.index({ type: 1, examType: 1 });
resourceSchema.index({ university: 1});

resourceSchema.index({
  branch: 1,
  semester: 1,
  subject: 1
});

resourceSchema.index({
  year: -1
});


resourceSchema.index({
  title: "text"
});

resourceSchema.index({
  uploadedBy: 1
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
