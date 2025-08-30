import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import QuizTaker from '../components/quiz/QuizTaker';
import LoadingSpinner from '../components/common/LoadingSpinner';

const QuizSessionPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuizById, startQuizSession, getQuizSession } = useQuiz();
  
  const [quiz, setQuiz] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    loadQuizAndSession();
  }, [quizId]);

  const loadQuizAndSession = async () => {
    try {
      setLoading(true);
      
      // Load quiz details
      const quizData = await getQuizById(quizId);
      setQuiz(quizData);

      // Check for existing session
      const existingSession = await getQuizSession(quizId);
      if (existingSession && existingSession.status === 'in_progress') {
        setSession(existingSession);
        setShowQuiz(true);
      } else if (existingSession && existingSession.status === 'completed') {
        // Redirect to results if already completed
        navigate(`/quiz/${quizId}/results`);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError(error.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      const newSession = await startQuizSession(quizId);
      setSession(newSession);
      setShowQuiz(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError(error.message || 'Failed to start quiz');
    }
  };

  const handleQuizComplete = (sessionData) => {
    navigate(`/quiz/${quizId}/results`);
  };

  const handleQuizExit = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="info">Quiz not found</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/browse-quizzes')}>
            Browse Quizzes
          </Button>
        </Box>
      </Container>
    );
  }

  if (showQuiz && session) {
    return (
      <QuizTaker
        quiz={quiz}
        session={session}
        onComplete={handleQuizComplete}
        onExit={handleQuizExit}
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {quiz.title}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            {quiz.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="body2">
              <strong>Category:</strong> {quiz.category}
            </Typography>
            <Typography variant="body2">
              <strong>Difficulty:</strong> {quiz.difficulty}
            </Typography>
            <Typography variant="body2">
              <strong>Questions:</strong> {quiz.questions.length}
            </Typography>
            <Typography variant="body2">
              <strong>Time Limit:</strong> {quiz.timeLimit} minutes
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/browse-quizzes')}
          >
            Back to Browse
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizSessionPage;
