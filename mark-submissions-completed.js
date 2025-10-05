const mongoose = require('mongoose');
const QuizSubmission = require('./models/QuizSubmission');
require('dotenv').config();

async function markSubmissionsCompleted() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizknow');

    const result = await QuizSubmission.updateMany(
      { isCompleted: false },
      { $set: { isCompleted: true, reviewedAt: new Date() } }
    );

    console.log(`Marked ${result.modifiedCount} submissions as completed`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

markSubmissionsCompleted();
