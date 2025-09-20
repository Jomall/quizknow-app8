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

// Get available quizzes for student
router.get('/available', auth, authorize('student'), async (req, res) => {
  try {
    console.log('Fetching available quizzes for student:', req.user.id);
    console.log('Student role:', req.user.role);

    const quizzes = await Quiz.find({
      'students.student': req.user.id,
      isPublished: true
    })
      .populate('instructor', 'username profile.firstName profile.lastName');

    console.log('Found quizzes:', quizzes.length);
    console.log('Quiz details:', quizzes.map(q => ({
      id: q._id,
      title: q.title,
      isPublished: q.isPublished,
      students: q.students.map(s => s.student.toString())
    })));

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching available quizzes:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get pending quizzes for student (submitted but not reviewed)
router.get('/pending', auth, authorize('student'), async (req, res) => {
  try {
    // Find submissions that are not completed
    const pendingSubmissionQuizzes = await QuizSubmission.find({
      student: req.user.id,
      isCompleted: false
    }).distinct('quiz');

    const quizzes = await Quiz.find({
      _id: { $in: pendingSubmissionQuizzes },
      'students.student': req.user.id,
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
    const submissions = await QuizSubmission.find({
      student: req.user.id,
      isCompleted: true
    })
      .populate('quiz', 'title instructor')
      .populate('quiz.instructor', 'username profile.firstName profile.lastName')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('instructor', 'username profile.firstName profile.lastName');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check permissions: instructor or assigned student
    const isInstructor = quiz.instructor._id.toString() === req.user.id;
    const isAssignedStudent = req.user.role === 'student' && quiz.students.some(s => s.student.toString() === req.user.id);

    if (!isInstructor && !isAssignedStudent) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Hide correct answers for non-instructors
    if (!isInstructor) {
      quiz.questions = quiz.questions.map(q => {
        const question = q.toObject();
        delete question.correctAnswer;
        delete question.correctAnswers;
        return question;
      });
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

module.exports = router;
