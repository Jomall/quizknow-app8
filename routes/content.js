const express = require('express');
const Content = require('../models/Content');
const { auth, authorize, checkApproved } = require('../middleware/auth');

const router = express.Router();

// Create content (instructor only)
router.post('/', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const content = new Content({
      ...req.body,
      instructor: req.user.id
    });
    
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all content (public - only published)
router.get('/', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let query = { isPublished: true };

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const content = await Content.find(query)
      .populate('instructor', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 });
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get instructor's content
router.get('/my-content', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const content = await Content.find({ instructor: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('instructor', 'username profile.firstName profile.lastName');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Hide content if not published and not the instructor
    if (!content.isPublished && (!req.user || content.instructor._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update content (instructor only)
router.put('/:id', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (content.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete content (instructor only)
router.delete('/:id', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (content.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
