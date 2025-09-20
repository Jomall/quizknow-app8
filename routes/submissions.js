const express = require('express');
const QuizSubmission = require('../models/QuizSubmission');
const Quiz = require('../models/Quiz');
const { auth, checkApproved } = require('../middleware/auth');

const router = express.Router();

// Submit quiz (student only)
router.post('/', auth, checkApproved, async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if student is assigned to this quiz
    const isAssigned = quiz.students.some(s =>
      s.student.toString() === req.user.id && !s.submittedAt
    );

    if (!isAssigned) {
      return res.status(403).json({ message: 'Not assigned to this quiz' });
    }

    // Calculate score
    let score = 0;
    const totalQuestions = quiz.questions.length;

    const submissionAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;

      if (isCorrect) score++;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    });

    const percentage = (score / totalQuestions) * 100;

    // Create submission
    const submission = new QuizSubmission({
      quiz: quizId,
      student: req.user.id,
      answers: submissionAnswers,
      score,
      percentage,
      maxScore: quiz.questions.reduce((total, q) => total + (q.points || 1), 0),
      totalQuestions
    });

    await submission.save();

    // Update quiz student record
    const studentIndex = quiz.students.findIndex(s =>
      s.student.toString() === req.user.id
    );
    quiz.students[studentIndex].submittedAt = new Date();
    await quiz.save();

    // Auto-complete if manual review not required
    if (!quiz.settings.requireManualReview) {
      submission.isCompleted = true;
      submission.reviewedAt = new Date();
      await submission.save();
    }

    res.status(201).json({
      message: 'Quiz submitted successfully',
      submission: {
        id: submission._id,
        score,
        percentage,
        totalQuestions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my submissions (student only)
router.get('/my-submissions', auth, async (req, res) => {
  try {
    const submissions = await QuizSubmission.find({ student: req.user.id })
      .populate('quiz', 'title instructor')
      .populate('quiz.instructor', 'username profile.firstName profile.lastName')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get submissions for a quiz (instructor only)
router.get('/quiz/:quizId', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submissions = await QuizSubmission.find({ quiz: req.params.quizId })
      .populate('student', 'username profile.firstName profile.lastName')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get submission by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await QuizSubmission.findById(req.params.id)
      .populate('quiz')
      .populate('student', 'username profile.firstName profile.lastName');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if user has access
    const isStudent = submission.student._id.toString() === req.user.id;
    const isInstructor = submission.quiz.instructor.toString() === req.user.id;

    if (!isStudent && !isInstructor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark submission as reviewed (instructor only)
router.put('/:id/review', auth, async (req, res) => {
  try {
    const submission = await QuizSubmission.findById(req.params.id)
      .populate('quiz');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    submission.reviewedAt = new Date();
    submission.isCompleted = true;
    await submission.save();

    res.json({ message: 'Submission marked as reviewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
