const express = require('express');
const User = require('../models/User');
const Connection = require('../models/Connection');
const Quiz = require('../models/Quiz');
const { auth, authorize, checkApproved } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
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
router.get('/pending-instructors', auth, authorize('admin'), async (req, res) => {
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
router.put('/approve-instructor/:id', auth, authorize('admin'), async (req, res) => {
  try {
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
router.put('/profile', auth, checkApproved, async (req, res) => {
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
router.get('/stats', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const totalStudents = await Connection.countDocuments({
      $or: [
        { sender: req.user.id, status: 'accepted' },
        { receiver: req.user.id, status: 'accepted' }
      ]
    });

    const totalQuizzes = await Quiz.countDocuments({ instructor: req.user.id });

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

module.exports = router;
