const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'instructor' }
];

const mockQuizzes = [
  { id: 1, title: 'JavaScript Basics', description: 'Test your JS knowledge', questions: 10 },
  { id: 2, title: 'React Fundamentals', description: 'React concepts quiz', questions: 8 }
];

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'QuizKnow API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  /api/users',
      'GET  /api/quizzes',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
});

// Mock endpoints
app.get('/api/users', (req, res) => {
  res.json(mockUsers);
});

app.get('/api/quizzes', (req, res) => {
  res.json(mockQuizzes);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    success: true,
    message: 'Login successful',
    user: mockUsers[0],
    token: 'mock-jwt-token-123'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  res.json({
    success: true,
    message: 'Registration successful',
    user: { id: 3, name, email, role },
    token: 'mock-jwt-token-456'
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/api/users`);
  console.log(`📝 Quizzes endpoint: http://localhost:${PORT}/api/quizzes`);
});
