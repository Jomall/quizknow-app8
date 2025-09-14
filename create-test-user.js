const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizknow-app4');
    
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
      isApproved: true
    });
    
    await testUser.save();
    console.log('Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test user:', error.message);
    mongoose.connection.close();
  }
}

createTestUser();
