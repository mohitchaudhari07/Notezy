const mongoose = require('mongoose');
const generateSlug = require('../utils/generateSlug');

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Branch code is required (e.g., CSE, ECE)'],
      uppercase: true,
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
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

// Unique compound index: Branch name or code under a single University
branchSchema.index({ name: 1, university: 1 }, { unique: true });
branchSchema.index({ code: 1, university: 1 }, { unique: true });

// Pre-save slug generation
branchSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = generateSlug(this.name);
  }
  next();
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
