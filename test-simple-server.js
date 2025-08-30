const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works!' });
});

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Test endpoint: http://localhost:5003/test');
});
