 const express = require('express');
const Content = require('../models/Content');
const { auth, authorize, checkApproved } = require('../middleware/auth');
const path = require('path');

const router = express.Router();

// Middleware to get multer upload from app
const getUpload = (req, res, next) => {
  req.upload = req.app.get('upload');
  next();
};

// Create content with file upload (instructor only)
router.post('/upload', auth, authorize('instructor'), checkApproved, getUpload, async (req, res) => {
  try {
    const upload = req.upload;

    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { title, type, description, tags, allowedStudents } = req.body;

      if (!title || !type) {
        return res.status(400).json({ message: 'Title and type are required' });
      }

      // Validate file upload for non-link types
      if (type !== 'link' && !req.file) {
        return res.status(400).json({ message: 'File is required for this content type' });
      }

      const contentData = {
        title,
        type,
        description,
        tags: tags ? JSON.parse(tags) : [],
        allowedStudents: allowedStudents ? JSON.parse(allowedStudents) : [],
        instructor: req.user.id
      };

      if (type === 'link') {
        contentData.url = req.body.url;
      } else {
        contentData.filePath = req.file.path;
        contentData.fileName = req.file.originalname;
        contentData.fileSize = req.file.size;
        contentData.mimeType = req.file.mimetype;
      }

      const content = new Content(contentData);
      await content.save();

      res.status(201).json(content);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

// Get assigned content for student
router.get('/assigned', auth, authorize('student'), async (req, res) => {
  try {
    const content = await Content.find({ allowedStudents: req.user.id })
      .populate('instructor', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 });

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single content by ID (for instructors and assigned students)
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('instructor', 'username profile.firstName profile.lastName');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Allow access if user is instructor or in allowedStudents
    const isInstructor = content.instructor._id.toString() === req.user.id;
    const isAllowedStudent = content.allowedStudents.includes(req.user.id);

    if (!isInstructor && !isAllowedStudent) {
      return res.status(403).json({ message: 'Access denied' });
    }

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

// Assign content to students (instructor only)
router.post('/:id/assign', auth, authorize('instructor'), checkApproved, async (req, res) => {
  try {
    const { studentIds } = req.body;
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (content.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add students to content allowedStudents if not already present
    const newStudents = studentIds.filter(id => !content.allowedStudents.includes(id));
    content.allowedStudents = [...content.allowedStudents, ...newStudents];
    await content.save();

    res.json({ message: 'Content assigned successfully', content });
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
