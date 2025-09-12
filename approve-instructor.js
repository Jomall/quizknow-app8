const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function approveInstructor(usernameOrEmail) {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizknow-app4';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find the instructor
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ],
      role: 'instructor'
    });

    if (!user) {
      console.log(`Instructor with username/email "${usernameOrEmail}" not found`);
      return;
    }

    console.log(`Found instructor: ${user.username} (${user.email})`);
    console.log(`Current approval status: ${user.isApproved}`);

    // Approve the instructor
    user.isApproved = true;
    await user.save();

    console.log(`✅ Instructor ${user.username} has been approved successfully!`);
    console.log(`Now they can access all instructor features including connection requests.`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Usage: node approve-instructor.js <username_or_email>
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node approve-instructor.js <username_or_email>');
  console.log('Example: node approve-instructor.js instructor1');
  console.log('Example: node approve-instructor.js instructor@example.com');
  process.exit(1);
}

approveInstructor(args[0]);
