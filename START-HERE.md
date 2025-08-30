# 🚀 Quick Start Guide - QuizKnow App 4

## Get Started in 2 Minutes!

### Option 1: Test Mode (No Setup Required!)
```bash
# 1. Install dependencies
npm install

# 2. Start test server (uses in-memory MongoDB)
npm run server-test

# 3. Test the API
node quick-test.js
```

### Option 2: Standard Mode (Requires MongoDB)
```bash
# 1. Install MongoDB locally or use MongoDB Atlas
# 2. Create .env file with your MongoDB URI
echo "MONGODB_URI=mongodb://localhost:27017/quizknow-app4" > .env
echo "JWT_SECRET=your-secret-key" >> .env

# 3. Install dependencies
npm install

# 4. Start the server
npm run dev
```

## 🎯 What You Can Do Right Now

### 1. Test the API Endpoints
- **Health Check**: `GET http://localhost:5000/`
- **Register**: `POST http://localhost:5000/api/auth/register`
- **Login**: `POST http://localhost:5000/api/auth/login`
- **Get Users**: `GET http://localhost:5000/api/users`
- **Create Quiz**: `POST http://localhost:5000/api/quizzes`

### 2. Use the Quick Test Script
```bash
node quick-test.js
```
This will automatically test all major endpoints and show you what's working.

### 3. Manual Testing with curl
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📁 Project Structure Overview

```
quizknow-app4/
├── models/           # Database models (User, Quiz, etc.)
├── routes/           # API endpoints
├── middleware/       # Authentication & validation
├── server.js         # Main server file
├── server-test.js    # Test server (no MongoDB needed)
├── package.json      # Dependencies
├── quick-test.js     # API testing script
└── README-UPDATED.md # Complete documentation
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run server-test` | Start test server (no MongoDB) |
| `npm run dev` | Start server with MongoDB |
| `npm run server` | Start server only |
| `node quick-test.js` | Test all API endpoints |

## 🚨 Troubleshooting

### "Cannot connect to MongoDB"
- **Solution**: Use `npm run server-test` instead of `npm run dev`

### "Port 5000 already in use"
- **Solution**: Change port in `.env` file: `PORT=5001`

### "Module not found"
- **Solution**: Run `npm install` to install all dependencies

## 🎉 Success Checklist

- [ ] `npm install` completed successfully
- [ ] `npm run server-test` starts without errors
- [ ] `node quick-test.js` shows all tests passing
- [ ] You can see "Server running on port 5000" message

## 📞 Need Help?

1. **Check the logs** - Look at the terminal output for error messages
2. **Read README-UPDATED.md** - Complete documentation with troubleshooting
3. **Test with quick-test.js** - It will tell you exactly what's working

## 🏁 Ready to Go!

Once you've completed the steps above, your QuizKnow API is ready to use. You can:
- Create quizzes
- Register users
- Take quizzes
- Share content
- Build connections

Start with: `npm run server-test` and then `node quick-test.js` to see everything in action!
