const mongoose = require('mongoose');
const generateSlug = require('../utils/generateSlug');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    logoUrl: {
      type: String,
      default: ''
    },
    shortName: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to generate slug
universitySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = generateSlug(this.name);
  }
  next();
});

const University = mongoose.model('University', universitySchema);

module.exports = University;
