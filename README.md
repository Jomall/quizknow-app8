# QuizKnow App4 - Advanced Quiz Platform

A comprehensive quiz application built with React frontend and Node.js backend, featuring real-time quiz sessions, advanced question types, and detailed analytics.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/register system with JWT tokens
- **Quiz Creation**: Create quizzes with multiple question types (multiple choice, true/false, fill-in-blank)
- **Real-time Sessions**: Live quiz sessions with progress tracking
- **Advanced Analytics**: Detailed quiz results and performance metrics
- **Responsive Design**: Fully responsive UI for all devices
- **Time Management**: Configurable time limits per quiz
- **Attempt Tracking**: Track quiz attempts and performance history

### Question Types
- Multiple Choice (single/multiple answers)
- True/False questions
- Fill-in-the-blank questions
- Mix and match question types in a single quiz

### User Roles
- **Students**: Take quizzes, view results, track progress
- **Instructors**: Create quizzes, manage questions, view analytics

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time features
- **JWT** for authentication
- **Multer** for file uploads

### Frontend
- **React 18** with functional components
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io-client** for real-time updates
- **CSS3** with modern styling

## 📁 Project Structure

```
quizknow-app4/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   ├── services/      # API services
│   │   └── styles/        # CSS files
├── models/                # MongoDB models
├── routes/               # API routes
├── middleware/           # Custom middleware
├── uploads/              # File uploads
└── server.js            # Main server file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd quizknow-app4
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Set up environment variables**
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/quizknow-app4
JWT_SECRET=your-secret-key-here
PORT=5000
```

5. **Start MongoDB**
Make sure MongoDB is running on your system.

6. **Run the application**
Using the provided startup script:
```bash
start-app.bat
```

Or manually:
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quizzes` - Get all published quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes` - Create new quiz (instructor)
- `PUT /api/quizzes/:id` - Update quiz (instructor)
- `DELETE /api/quizzes/:id` - Delete quiz (instructor)

### Quiz Sessions
- `POST /api/quiz/:quizId/start` - Start quiz session
- `POST /api/quiz/:quizId/submit` - Submit quiz answers
- `GET /api/quiz/:quizId/session/:sessionId` - Get session details
- `PUT /api/quiz/:quizId/session/:sessionId/answer` - Update answer
- `GET /api/quiz/:quizId/session/:sessionId/progress` - Get progress

## 🎯 Usage Guide

### For Students
1. Register an account or login
2. Browse available quizzes on the dashboard
3. Click "Take Quiz" to start a session
4. Answer questions within the time limit
5. View detailed results and analytics
6. Track your progress over time

### For Instructors
1. Register as an instructor
2. Create new quizzes with the quiz builder
3. Add questions of different types
4. Set time limits and other parameters
5. Publish quizzes for students
6. View analytics and student performance

## 🧪 Testing

### Backend Testing
```bash
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Deploy to Heroku, AWS, or similar platform
3. Ensure MongoDB Atlas connection

### Frontend Deployment
1. Build the frontend:
```bash
cd client
npm run build
```
2. Deploy the build folder to Netlify, Vercel, or similar platform

## 🔧 Development

### Adding New Question Types
1. Update the Quiz model
2. Add new question type in QuestionRenderer component
3. Update validation logic
4. Add styling for new type

### Custom Styling
- Main styles: `client/src/index.css`
- Component-specific styles are co-located with components

## 📊 Analytics Features

- Quiz completion rates
- Average scores by quiz
- Time spent per question
- Question difficulty analysis
- Student performance tracking
- Detailed answer breakdown

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Secure file upload handling

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB connection failed**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **Port already in use**
   - Change PORT in .env file
   - Kill existing processes

3. **CORS errors**
   - Check frontend proxy configuration
   - Verify backend CORS settings

4. **Build failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support, email support@quizknow.com or create an issue in the repository.
