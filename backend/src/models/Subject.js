const mongoose = require('mongoose');
const generateSlug = require('../utils/generateSlug');
const { SEMESTERS } = require('../utils/constants');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Subject code is required (e.g., CS801)'],
      uppercase: true,
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    semester: {
      type: Number,
      enum: Object.values(SEMESTERS),
      required: [true, 'Semester is required (1 to 8)']
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Branch mapping is required']
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University mapping is required']
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure Subject code is unique per University
subjectSchema.index({ code: 1, university: 1 }, { unique: true });
subjectSchema.index({ name: 1, branch: 1, semester: 1 }, { unique: true });

// Pre-save slug generator
subjectSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = generateSlug(this.name);
  }
  next();
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
