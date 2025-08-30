const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
    console.log('🧪 Testing QuizKnow API...\n');

    try {
        // Test health check
        console.log('1. Testing health check...');
        const health = await axios.get(`${BASE_URL}/`);
        console.log('✅ Health check passed:', health.data);

        // Test registration
        console.log('\n2. Testing registration...');
        const registerData = {
            username: 'testuser' + Date.now(),
            email: `test${Date.now()}@example.com`,
            password: 'test123',
            role: 'student'
        };
        
        const register = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
        console.log('✅ Registration successful:', register.data);

        // Test login
        console.log('\n3. Testing login...');
        const login = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: registerData.email,
            password: registerData.password
        });
        console.log('✅ Login successful:', login.data);

        const token = login.data.token;

        // Test getting users
        console.log('\n4. Testing get users...');
        const users = await axios.get(`${BASE_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Users retrieved:', users.data.data.length, 'users found');

        // Test creating a quiz
        console.log('\n5. Testing quiz creation...');
        const quizData = {
            title: 'Test Quiz ' + Date.now(),
            description: 'A test quiz for API testing',
            questions: [
                {
                    question: 'What is 2+2?',
                    type: 'multiple-choice',
                    options: ['3', '4', '5', '6'],
                    correctAnswer: '4',
                    points: 10
                },
                {
                    question: 'Is Node.js a backend framework?',
                    type: 'true-false',
                    correctAnswer: true,
                    points: 5
                }
            ],
            timeLimit: 300,
            category: 'General Knowledge',
            difficulty: 'easy'
        };

        const quiz = await axios.post(`${BASE_URL}/api/quizzes`, quizData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Quiz created:', quiz.data.data.title);

        // Test getting quizzes
        console.log('\n6. Testing get quizzes...');
        const quizzes = await axios.get(`${BASE_URL}/api/quizzes`);
        console.log('✅ Quizzes retrieved:', quizzes.data.data.length, 'quizzes found');

        console.log('\n🎉 All API tests passed successfully!');
        console.log('\n📊 Summary:');
        console.log('- Health check: ✅');
        console.log('- Registration: ✅');
        console.log('- Login: ✅');
        console.log('- User management: ✅');
        console.log('- Quiz creation: ✅');
        console.log('- Quiz retrieval: ✅');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run tests if server is running
console.log('🔍 Checking if server is running...');
axios.get(`${BASE_URL}/`)
    .then(() => {
        console.log('✅ Server is running, starting tests...\n');
        testAPI();
    })
    .catch(() => {
        console.log('❌ Server not running. Start with: npm run server-test');
        console.log('Then run: node quick-test.js');
    });
