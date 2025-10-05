const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const QuizSubmission = require('./models/QuizSubmission');

async function fixSubmittedAt() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizknow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all quiz submissions
    const submissions = await QuizSubmission.find({}).populate('quiz');

    console.log(`Found ${submissions.length} submissions`);

    for (const submission of submissions) {
      const quiz = submission.quiz;
      if (quiz) {
        // Find the student in the quiz students array
        const studentIndex = quiz.students.findIndex(s =>
          s.student.toString() === submission.student.toString()
        );

        if (studentIndex !== -1) {
          // Set submittedAt if not already set
          if (!quiz.students[studentIndex].submittedAt) {
            quiz.students[studentIndex].submittedAt = submission.submittedAt || new Date();
            await quiz.save();
            console.log(`Updated submittedAt for quiz ${quiz.title} and student ${submission.student}`);
          }
        }
      }
    }

    console.log('Finished updating submittedAt fields');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixSubmittedAt();
