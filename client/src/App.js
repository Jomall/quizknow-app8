import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizListPage from './pages/QuizListPage';
import QuizSessionPage from './pages/QuizSessionPage';
import QuizResultsPage from './pages/QuizResultsPage';
import ProfilePage from './pages/ProfilePage';
import QuizReviewPage from './pages/QuizReviewPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/create-quiz" element={
                <ProtectedRoute>
                  <CreateQuizPage />
                </ProtectedRoute>
              } />
              <Route path="/quizzes" element={<QuizListPage />} />
              <Route path="/quiz/:quizId" element={<QuizSessionPage />} />
              <Route path="/quiz-results/:sessionId" element={<QuizResultsPage />} />
              <Route path="/quiz-review/:quizId" element={<QuizReviewPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
