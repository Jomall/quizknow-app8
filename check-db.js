const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const QuizSubmission = require('./models/QuizSubmission');
const User = require('./models/User'); // Register User model

async function checkDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizknow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all quizzes
    const quizzes = await Quiz.find({}).populate('instructor', 'username').populate('students.student', 'username');

    console.log(`\nFound ${quizzes.length} quizzes:`);

    for (const quiz of quizzes) {
      console.log(`\nQuiz: ${quiz.title} (by ${quiz.instructor?.username})`);
      console.log(`Students assigned: ${quiz.students.length}`);
      quiz.students.forEach(s => {
        console.log(`  - ${s.student?.username}: assignedAt=${s.assignedAt}, submittedAt=${s.submittedAt}`);
      });
    }

    // Find all submissions
    const submissions = await QuizSubmission.find({}).populate('student', 'username').populate('quiz', 'title');

    console.log(`\nFound ${submissions.length} submissions:`);

    submissions.forEach(sub => {
      console.log(`  - ${sub.student?.username} submitted "${sub.quiz?.title}" at ${sub.submittedAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDB();
