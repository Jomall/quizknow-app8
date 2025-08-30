const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Try to connect to MongoDB using a cloud-based solution or local memory
async function startServer() {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Try local MongoDB first
    await mongoose.connect('mongodb://localhost:27017/quizknow-app4', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to local MongoDB');
    
  } catch (localError) {
    console.log('❌ Local MongoDB not available, trying MongoDB Memory Server...');
    
    try {
      // Try MongoDB Memory Server
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB Memory Server');
      
    } catch (memoryError) {
      console.log('❌ MongoDB Memory Server failed, trying simple in-memory setup...');
      
      // Fallback to simple test without database
      console.log('⚠️  Starting server without database connection');
    }
  }

  // Simple health check endpoint
  app.get('/', (req, res) => {
    res.json({ 
      message: 'QuizKnow API is running!',
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected',
      timestamp: new Date().toISOString()
    });
  });

  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check available at: http://localhost:${PORT}/`);
  });
}

startServer().catch(console.error);
