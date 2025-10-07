const express = require('express');
const Connection = require('../models/Connection');
const User = require('../models/User');
const { auth, checkApproved } = require('../middleware/auth');

const router = express.Router();

// Send connection request
router.post('/request', auth, async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    const connection = new Connection({
      sender: req.user.id,
      receiver: receiverId,
      message
    });

    await connection.save();
    
    const populatedConnection = await Connection.findById(connection._id)
      .populate('sender receiver', 'username profile.firstName profile.lastName profile.avatar role');

    res.status(201).json({
      message: 'Connection request sent successfully',
      connection: populatedConnection
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept connection request
router.put('/accept/:id', auth, checkApproved, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If the receiver is an instructor, check student limit
    if (req.user.role === 'instructor') {
      const instructor = await User.findById(req.user.id);
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor not found' });
      }

      // Count current accepted student connections
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

      const currentStudents = result.length > 0 ? result[0].total : 0;

      if (currentStudents >= instructor.studentLimit) {
        return res.status(400).json({
          message: `Student limit reached. You can only have up to ${instructor.studentLimit} students. Current: ${currentStudents}`
        });
      }
    }

    connection.status = 'accepted';
    connection.updatedAt = new Date();
    await connection.save();

    const populatedConnection = await Connection.findById(connection._id)
      .populate('sender receiver', 'username profile.firstName profile.lastName profile.avatar role');

    res.json({
      message: 'Connection accepted successfully',
      connection: populatedConnection
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject connection request
router.put('/reject/:id', auth, checkApproved, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    connection.status = 'rejected';
    connection.updatedAt = new Date();
    await connection.save();

    res.json({ message: 'Connection rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my connections
router.get('/my-connections', auth, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
      status: { $in: ['accepted', 'pending'] }
    })
    .populate('sender receiver', 'username profile.firstName profile.lastName profile.avatar role')
    .sort({ updatedAt: -1 });

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending connection requests
router.get('/pending-requests', auth, checkApproved, async (req, res) => {
  try {
    const pendingRequests = await Connection.find({
      receiver: req.user.id,
      status: 'pending'
    })
    .populate('sender', 'username profile.firstName profile.lastName profile.avatar role')
    .sort({ createdAt: -1 });

    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sent connection requests
router.get('/sent-requests', auth, async (req, res) => {
  try {
    const sentRequests = await Connection.find({
      sender: req.user.id,
      status: 'pending'
    })
    .populate('receiver', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ createdAt: -1 });

    res.json(sentRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get accepted connections (for instructor dashboard)
router.get('/accepted-connections', auth, checkApproved, async (req, res) => {
  try {
    const acceptedConnections = await Connection.find({
      receiver: req.user.id,
      status: 'accepted'
    })
    .populate('sender', 'username profile.firstName profile.lastName profile.avatar role')
    .sort({ updatedAt: -1 });

    res.json(acceptedConnections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove connection
router.delete('/:id', auth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const isSender = connection.sender.toString() === req.user.id;
    const isReceiver = connection.receiver.toString() === req.user.id;

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If user is sender (student), allow without approval
    // If user is receiver (instructor), require approval
    if (isReceiver && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Connection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Connection removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
