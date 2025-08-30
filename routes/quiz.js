const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizSession = require('../models/QuizSession');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all quizzes with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      difficulty,
      tags,
      search,
      isPublished,
      instructor
    } = req.query;

    const query = {};
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (instructor) query.instructor = instructor;

    const quizzes = await Quiz.find(query)
      .populate('instructor', 'name email')
      .select('-questions.correctAnswer -questions.correctAnswers')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quiz.countDocuments(query);

    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single quiz by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('students.student', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Remove correct answers if quiz is not published and user is not the instructor
    if (!quiz.isPublished && quiz.instructor._id.toString() !== req.user.id) {
      const quizWithoutAnswers = quiz.toObject();
      quizWithoutAnswers.questions = quizWithoutAnswers.questions.map(q => {
        delete q.correctAnswer;
        delete q.correctAnswers;
        return q;
      });
      return res.json(quizWithoutAnswers);
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new quiz
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = new Quiz({
      ...req.body,
      instructor: req.user.id
    });

    await quiz.save();
    await quiz.populate('instructor', 'name email');
    
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quiz
router.put('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }

    Object.assign(quiz, req.body);
    await quiz.save();
    await quiz.populate('instructor', 'name email');
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete quiz
router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Publish/unpublish quiz
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    quiz.isPublished = req.body.isPublished;
    await quiz.save();
    
    res.json({ message: `Quiz ${quiz.isPublished ? 'published' : 'unpublished'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign quiz to students
router.post('/:id/assign', auth, async (req, res) => {
  try {
    const { studentIds, dueDate } = req.body;
    
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newAssignments = studentIds.map(studentId => ({
      student: studentId,
      dueDate: dueDate ? new Date(dueDate) : undefined
    }));

    quiz.students = [...quiz.students, ...newAssignments];
    await quiz.save();
    
    res.json({ message: 'Quiz assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz analytics
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const sessions = await QuizSession.find({ quiz: req.params.id })
      .populate('student', 'name email')
      .sort({ startedAt: -1 });

    const analytics = {
      totalAttempts: quiz.analytics.totalAttempts,
      averageScore: quiz.analytics.averageScore,
      completionRate: quiz.analytics.completionRate,
      averageTime: quiz.analytics.averageTime,
      sessions: sessions.map(session => ({
        student: session.student,
        score: session.score,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        timeSpent: session.timeSpent,
        answers: session.answers.length
      }))
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz questions for taking (without answers)
router.get('/:id/take', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('instructor', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(403).json({ message: 'Quiz is not published' });
    }

    // Check if student is assigned
    const isAssigned = quiz.students.some(s => 
      s.student.toString() === req.user.id
    );

    if (!isAssigned && quiz.instructor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to this quiz' });
    }

    // Create quiz session
    const session = new QuizSession({
      quiz: req.params.id,
      student: req.user.id,
      startedAt: new Date()
    });
    await session.save();

    // Prepare questions without answers
    let questions = quiz.questions.map(q => {
      const question = {
        _id: q._id,
        type: q.type,
        question: q.question,
        description: q.description,
        points: q.points,
        order: q.order,
        media: q.media,
        hints: q.hints,
        options: q.options.map(opt => ({
          text: opt.text
        }))
      };
      return question;
    });

    // Randomize questions if enabled
    if (quiz.settings.randomizeQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    // Randomize options for multiple choice if enabled
    if (quiz.settings.randomizeOptions) {
      questions = questions.map(q => {
        if (q.options) {
          q.options = q.options.sort(() => Math.random() - 0.5);
        }
        return q;
      });
    }

    res.json({
      sessionId: session._id,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        instructions: quiz.instructions,
        settings: quiz.settings,
        totalPoints: quiz.totalPoints,
        questionCount: quiz.questionCount
      },
      questions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
