const express = require('express');
const User = require('../models/User');
const Connection = require('../models/Connection');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Content = require('../models/Content');
const ContentView = require('../models/ContentView');
const { auth, authorize, checkApproved, checkSuspended } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, authorize('admin'), checkSuspended, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all instructors (public)
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('-password');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pending instructors (admin only)
router.get('/pending-instructors', auth, authorize('admin'), checkSuspended, async (req, res) => {
  try {
    const pendingInstructors = await User.find({ 
      role: 'instructor', 
      isApproved: false 
    }).select('-password');
    res.json(pendingInstructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve instructor (admin only)
router.put('/approve-instructor/:id', auth, authorize('admin'), checkSuspended, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(req.params.id);
    
    if (!user || user.role !== 'instructor') {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'Instructor approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, checkApproved, checkSuspended, async (req, res) => {
  try {
    const { profile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get instructor stats
router.get('/stats', auth, authorize('instructor'), checkApproved, checkSuspended, async (req, res) => {
  try {
    // Count accepted connections where the other party is a student
    const result = await Connection.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id, status: 'accepted' },
            { receiver: req.user._id, status: 'accepted' }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { otherId: { $cond: { if: { $eq: ['$sender', req.user._id] }, then: '$receiver', else: '$sender' } } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$otherId'] }, role: 'student' } }
          ],
          as: 'otherUser'
        }
      },
      {
        $match: { 'otherUser.0': { $exists: true } }
      },
      {
        $count: 'total'
      }
    ]);

    const totalStudents = result.length > 0 ? result[0].total : 0;
    const totalQuizzes = await Quiz.countDocuments({ instructor: req.user._id });

    // You can add more stats here like total content, average score, etc.

    res.json({
      totalStudents,
      totalQuizzes,
      averageScore: 0, // placeholder
      completionRate: 0, // placeholder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Suspend/unsuspend user (admin only)
router.put('/suspend/:id', auth, authorize('admin'), checkSuspended, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent suspending the last active admin
    if (user.role === 'admin' && !user.isSuspended) {
      const activeAdmins = await User.countDocuments({ role: 'admin', isSuspended: false });
      if (activeAdmins <= 1) {
        return res.status(400).json({ message: 'Cannot suspend the last active admin user' });
      }
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({ message: `User ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin only) with cascading deletes
router.delete('/:id', auth, authorize('admin'), checkSuspended, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }

    // Cascading deletes
    // Delete connections where user is sender or receiver
    await Connection.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // If instructor, delete their quizzes and related submissions
    if (user.role === 'instructor') {
      const quizzes = await Quiz.find({ instructor: userId });
      const quizIds = quizzes.map(q => q._id);

      // Delete quiz submissions for these quizzes
      await QuizSubmission.deleteMany({ quiz: { $in: quizIds } });

      // Delete the quizzes
      await Quiz.deleteMany({ instructor: userId });

      // Delete content and related views
      await ContentView.deleteMany({ content: { $in: await Content.find({ instructor: userId }).distinct('_id') } });
      await Content.deleteMany({ instructor: userId });
    }

    // If student, delete their submissions
    if (user.role === 'student') {
      await QuizSubmission.deleteMany({ student: userId });
      await ContentView.deleteMany({ student: userId });
    }

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get quiz stats for student
router.get('/quiz-stats', auth, authorize('student'), checkSuspended, async (req, res) => {
  try {
    const submissions = await QuizSubmission.find({ student: req.user.id });

    const totalQuizzes = submissions.length;
    const completedQuizzes = submissions.filter(s => s.isCompleted).length;
    const scores = submissions.filter(s => s.score !== undefined).map(s => s.score);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const totalTime = submissions.reduce((acc, s) => acc + (s.timeSpent || 0), 0);

    res.json({
      totalQuizzes,
      completedQuizzes,
      averageScore,
      totalTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
