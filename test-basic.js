console.log('Testing basic Node.js functionality...');
console.log('Current directory:', process.cwd());
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);

// Test if we can require basic modules
try {
  const fs = require('fs');
  const path = require('path');
  console.log('✅ Basic modules loaded successfully');
  
  // Test file operations
  const testFile = path.join(__dirname, 'test-file.txt');
  fs.writeFileSync(testFile, 'Test content');
  console.log('✅ File operations working');
  fs.unlinkSync(testFile);
  
} catch (error) {
  console.error('❌ Error loading modules:', error.message);
}

// Test HTTP server
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from test server!');
});

server.listen(3001, () => {
  console.log('✅ Test HTTP server running on port 3001');
  console.log('Visit: http://localhost:3001/');
  
  // Close after 5 seconds
  setTimeout(() => {
    server.close();
    console.log('Test completed successfully!');
    process.exit(0);
  }, 5000);
});
