const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Resource reference is required'],
      unique: true
    },
    summaryText: {
      type: String,
      required: [true, 'AI generated summary content is required']
    },
    keyTakeaways: [
      {
        type: String
      }
    ],
    chapters: [
      {
        title: String,
        topics: [String],
        importance: {
          type: String,
          enum: ['High', 'Medium', 'Low'],
          default: 'Medium'
        }
      }
    ],
    keyFormulas: [
      {
        formula: String,
        description: String
      }
    ],
    tokensUsed: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
