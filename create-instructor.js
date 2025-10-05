const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createInstructor() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizknow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if instructor already exists
    let user = await User.findOne({ email: 'instructor@example.com' });
    if (!user) {
      user = new User({
        username: 'instructor',
        email: 'instructor@example.com',
        password: 'password123',
        role: 'instructor',
        profile: {
          firstName: 'Test',
          lastName: 'Instructor',
        },
        isApproved: true,
      });
      await user.save();
      console.log('Instructor created');
    } else {
      console.log('Instructor already exists');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating instructor:', error);
  }
}

createInstructor();
