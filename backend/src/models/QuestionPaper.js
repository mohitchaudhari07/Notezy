const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema(
  {
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required (FE, SE, TE, BE, etc.)'],
      trim: true
    },
    pattern: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    examType: {
      type: String,
      trim: true
    },
    session: {
      type: String,
      trim: true
    },
    examYear: {
      type: Number,
      required: [true, 'Exam year is required']
    },
    fileName: {
      type: String,
      trim: true
    },
    pdfUrl: {
      type: String,
      required: [true, 'PDF file URL is required']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'questionpapers',
    timestamps: false
  }
);

// Indexing for fast search and filters
questionPaperSchema.index({ university: 1, branch: 1, academicYear: 1 });
questionPaperSchema.index({ subject: 1 });
questionPaperSchema.index({ subject: 'text', branch: 'text' }); // Enable text search on subjects and streams
questionPaperSchema.index({
  isApproved: 1,
  createdAt: -1
});

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);

module.exports = QuestionPaper;
