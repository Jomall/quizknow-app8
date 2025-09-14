const mongoose = require('mongoose');

const contentViewSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: {
      type: String
    },
    submittedAt: {
      type: Date
    }
  }
});

// Compound index to ensure one view per student per content
contentViewSchema.index({ content: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('ContentView', contentViewSchema);
