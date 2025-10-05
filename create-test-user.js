const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizknow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if test user already exists
    let user = await User.findOne({ email: 'testuser@example.com' });
    if (!user) {
      user = new User({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123', // Make sure password hashing middleware is in place
        role: 'student',
        profile: {
          firstName: 'Test',
          lastName: 'User',
        },
        isApproved: true,
      });
      await user.save();
      console.log('Test user created');
    } else {
      console.log('Test user already exists');
    }

    // Generate JWT token
const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '7d' }
);

    console.log('JWT Token:', token);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
