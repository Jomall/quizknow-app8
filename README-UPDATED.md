# QuizKnow App 4 - Educational Platform Backend

A comprehensive educational platform backend built with Node.js, Express, and MongoDB, featuring real-time communication, quiz management, content creation, and social learning features.

## 🚀 Quick Start (No MongoDB Required!)

### Test Mode (Recommended for Quick Testing)
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the test server** (uses in-memory MongoDB):
   ```bash
   npm run server-test
   ```
   
   Or on Windows:
   ```bash
   run-test.bat
   ```

3. **Test the API**:
   - Health check: `GET http://localhost:5000/`
   - Register: `POST http://localhost:5000/api/auth/register`
   - Login: `POST http://localhost:5000/api/auth/login`

### Standard Mode (Requires MongoDB)
1. **Install MongoDB** on your system
2. **Set up environment variables** in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/quizknow-app4
   JWT_SECRET=your-secret-key
   PORT=5000
   ```
3. **Start the server**:
   ```bash
   npm run dev
   ```

## 📋 Features

### User Management
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Profiles**: Complete user profiles with educational background and preferences
- **Role Management**: Support for students, educators, and administrators

### Quiz System
- **Quiz Creation**: Educators can create quizzes with various question types
- **Quiz Taking**: Students can take quizzes with real-time scoring
- **Question Types**: Multiple choice, true/false, fill-in-the-blank, and essay questions
- **Time Limits**: Configurable time limits per quiz
- **Attempts**: Track quiz attempts and best scores

### Content Management
- **Educational Content**: Create and manage educational materials
- **Content Types**: Support for text, images, videos, and documents
- **Categories**: Organize content by subject and difficulty level
- **Search & Filter**: Advanced search and filtering capabilities

### Social Learning
- **Connections**: Follow other users and build learning networks
- **Collaboration**: Share quizzes and content with connections
- **Notifications**: Real-time notifications for quiz results and new content
- **Messaging**: Direct messaging between users

### Real-time Features
- **Live Quizzes**: Real-time quiz sessions with multiple participants
- **Instant Notifications**: Push notifications for important events
- **Activity Feed**: Real-time updates from connections

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account
- `GET /api/users/search` - Search users

### Quizzes
- `GET /api/quizzes` - Get all quizzes (with filters)
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `GET /api/quizzes/user/:userId` - Get user's quizzes

### Submissions
- `POST /api/submissions` - Submit quiz answers
- `GET /api/submissions/:id` - Get submission details
- `GET /api/submissions/user/:userId` - Get user's submissions
- `GET /api/submissions/quiz/:quizId` - Get quiz submissions

### Content
- `GET /api/content` - Get all content
- `GET /api/content/:id` - Get content by ID
- `POST /api/content` - Create new content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `POST /api/content/:id/like` - Like/unlike content

### Connections
- `POST /api/connections` - Send connection request
- `GET /api/connections/:userId` - Get user's connections
- `PUT /api/connections/:id/accept` - Accept connection request
- `PUT /api/connections/:id/reject` - Reject connection request
- `DELETE /api/connections/:id` - Remove connection

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

### Development
- **Nodemon** - Development server
- **Dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing
- **MongoDB Memory Server** - In-memory MongoDB for testing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step-by-step Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd quizknow-app4
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Choose your setup mode**:

   **For Test Mode (No MongoDB)**:
   - No additional setup needed! Just run `npm run server-test`

   **For Standard Mode**:
   - Install MongoDB locally or use MongoDB Atlas
   - Create `.env` file:
     ```env
     MONGODB_URI=mongodb://localhost:27017/quizknow-app4
     JWT_SECRET=your-secret-key-here
     PORT=5000
     NODE_ENV=development
     ```

4. **Start the application**:
   ```bash
   # Test mode (recommended for quick testing)
   npm run server-test
   
   # Standard mode
   npm run dev
   ```

## 🧪 Testing

### Quick API Testing
1. **Start the test server**:
   ```bash
   npm run server-test
   ```

2. **Test with curl**:
   ```bash
   # Health check
   curl http://localhost:5000/
   
   # Register new user
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"test123","role":"student"}'
   
   # Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. **Test with Postman**:
   - Import the API collection (link to be provided)
   - Set base URL to `http://localhost:5000`

### Available Scripts
- `npm run dev` - Start both server and client in development mode
- `npm run server` - Start only the server with nodemon
- `npm run server-test` - Start server with MongoDB Memory Server (no MongoDB required)
- `npm run client` - Start only the client
- `npm run build` - Build the client for production
- `npm run install-all` - Install all dependencies (server + client)

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/quizknow-app4` | No (for test mode) |
| `JWT_SECRET` | Secret key for JWT tokens | Required | Yes |
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Environment mode | `development` | No |

## 📊 Database Schema

### User Model
- Personal information (name, email, password)
- Educational background
- Role (student/educator/admin)
- Profile settings
- Timestamps

### Quiz Model
- Title and description
- Questions with various types
- Time limits and settings
- Creator reference
- Timestamps

### Question Model
- Question text
- Question type
- Options (for multiple choice)
- Correct answer
- Points

### Submission Model
- User reference
- Quiz reference
- Answers
- Score
- Time taken
- Timestamps

### Content Model
- Title and description
- Content type
- File references
- Creator reference
- Likes and interactions
- Timestamps

### Connection Model
- Requester reference
- Recipient reference
- Status (pending/accepted/rejected)
- Timestamps

## 📡 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## 🔒 Security Features

- **Password hashing** - Bcrypt for secure password storage
- **JWT tokens** - Secure authentication tokens
- **Input validation** - Request body validation
- **Rate limiting** - API rate limiting (to be implemented)
- **CORS protection** - Cross-origin resource sharing configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@quizknow.com or join our Slack channel.

## 🎯 Quick Start Summary

**For immediate testing without any setup:**
1. `npm install`
2. `npm run server-test`
3. Visit `http://localhost:5000/` to see the API running!

The test server will automatically:
- ✅ Create an in-memory MongoDB database
- ✅ Start the Express server on port 5000
- ✅ Initialize all API endpoints
- ✅ Be ready for testing in under 30 seconds
