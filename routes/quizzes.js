const express = require('express');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const { auth, authorize, checkApproved } = require('../middleware/auth');

const router = express.Router();

// Create quiz (instructor only)
router.post('/', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const quiz = new Quiz({
      ...req.body,
      instructor: req.user.id
    });
    
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all quizzes (public - only published)
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true })
      .populate('instructor', 'username profile.firstName profile.lastName')
      .select('-questions');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get instructor's quizzes
router.get('/my-quizzes', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ instructor: req.user.id })
      .populate('students.student', 'username profile.firstName profile.lastName');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('instructor', 'username profile.firstName profile.lastName');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Hide questions if not published and not the instructor
    if (!quiz.isPublished && (!req.user || quiz.instructor._id.toString() !== req.user.id)) {
      quiz.questions = [];
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quiz (instructor only)
router.put('/:id', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete quiz (instructor only)
router.delete('/:id', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign quiz to students (instructor only)
router.post('/:id/assign', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const { studentIds } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add students to quiz
    const newStudents = studentIds.map(id => ({
      student: id,
      assignedAt: new Date()
    }));

    quiz.students = [...quiz.students, ...newStudents];
    await quiz.save();

    res.json({ message: 'Quiz assigned successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Publish quiz to students (instructor only)
router.post('/:id/publish', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const { studentIds } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Set as published
    quiz.isPublished = true;

    // Add students to quiz
    const newStudents = studentIds.map(id => ({
      student: id,
      assignedAt: new Date()
    }));

    quiz.students = [...quiz.students, ...newStudents];
    await quiz.save();

    res.json({ message: 'Quiz published successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available quizzes for student
router.get('/available', auth, authorize('student'), async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      'students.student': req.user.id,
      isPublished: true
    })
      .populate('instructor', 'username profile.firstName profile.lastName');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending quizzes for student (assigned but not submitted)
router.get('/pending', auth, authorize('student'), async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      'students.student': req.user.id,
      'students.submittedAt': { $exists: false },
      isPublished: true
    })
      .populate('instructor', 'username profile.firstName profile.lastName');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get submitted quizzes for student
router.get('/submitted', auth, authorize('student'), async (req, res) => {
  try {
    const QuizSubmission = require('../models/QuizSubmission');
    const submissions = await QuizSubmission.find({ student: req.user.id })
      .populate('quiz', 'title instructor')
      .populate('quiz.instructor', 'username profile.firstName profile.lastName')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
