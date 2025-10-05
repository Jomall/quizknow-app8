const mongoose = require('mongoose');
const User = require('./models/User');

async function checkInstructor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizknow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const instructors = await User.find({ role: 'instructor' });
    console.log(`Found ${instructors.length} instructors:`);
    instructors.forEach(instructor => {
      console.log(`  - ${instructor.username}: isApproved=${instructor.isApproved}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkInstructor();
