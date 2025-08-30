const mongoose = require('mongoose');

const quizSessionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    points: Number,
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired', 'abandoned'],
    default: 'active'
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
quizSessionSchema.index({ quiz: 1, student: 1 });
quizSessionSchema.index({ status: 1 });
quizSessionSchema.index({ createdAt: -1 });

// Virtual for time remaining
quizSessionSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'active') return 0;
  
  const now = new Date();
  const elapsed = Math.floor((now - this.startTime) / 1000 / 60); // minutes
  return Math.max(0, this.timeLimit - elapsed);
});

// Virtual for completion percentage
quizSessionSchema.virtual('completionPercentage').get(function() {
  if (!this.answers.length) return 0;
  return Math.round((this.answers.length / this.quiz.questions.length) * 100);
});

module.exports = mongoose.model('QuizSession', quizSessionSchema);
