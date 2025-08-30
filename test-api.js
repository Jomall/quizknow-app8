const http = require('http');

function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5001${endpoint}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ ${endpoint}:`, JSON.stringify(jsonData, null, 2));
          resolve(jsonData);
        } catch (error) {
          console.log(`❌ ${endpoint}: Error parsing JSON -`, data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${endpoint}: Connection error -`, error.message);
      reject(error);
    });

    req.end();
  });
}

async function testAllEndpoints() {
  console.log('🧪 Testing QuizKnow API endpoints...\n');
  
  try {
    await testEndpoint('/');
    console.log('');
    await testEndpoint('/api/users');
    console.log('');
    await testEndpoint('/api/quizzes');
    console.log('');
    
    console.log('🎉 All endpoints tested successfully!');
  } catch (error) {
    console.log('❌ Some tests failed');
  }
}

testAllEndpoints();
