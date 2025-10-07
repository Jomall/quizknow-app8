import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
  ArrowBack as BackIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { printQuizResults } from '../utils/printResults';

const QuizReviewPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuizSession, getQuizById } = useQuiz();
  
  const [session, setSession] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    loadReviewData();
  }, [quizId]);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      
      const [sessionData, quizData] = await Promise.all([
        getQuizSession(quizId),
        getQuizById(quizId),
      ]);
      
      setSession(sessionData);
      setQuiz(quizData);
    } catch (error) {
      console.error('Error loading review data:', error);
      setError(error.message || 'Failed to load quiz review');
    } finally {
      setLoading(false);
    }
  };

  const getAnswerStatus = (questionId, selectedAnswer) => {
    const answer = session?.answers.find(a => a.questionId === questionId);
    if (!answer) return 'not-answered';
    
    return answer.isCorrect ? 'correct' : 'incorrect';
  };

  const getCorrectAnswer = (question) => {
    if (question.type === 'multiple-choice') {
      return question.options.findIndex(option => option.isCorrect);
    } else if (question.type === 'true-false') {
      return question.correctAnswer;
    }
    return null;
  };

  const getUserAnswer = (questionId) => {
    const answer = session?.answers.find(a => a.questionId === questionId);
    return answer?.selectedAnswer || null;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<BackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  if (!session || !quiz) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="info">Quiz review not found</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<BackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const userAnswer = getUserAnswer(currentQuestion._id);
  const status = getAnswerStatus(currentQuestion._id, userAnswer);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate(`/quiz/${quizId}/results`)}
            sx={{ mr: 2 }}
          >
            Back to Results
          </Button>
          <Typography variant="h4" sx={{ flex: 1 }}>
            Quiz Review
          </Typography>
        </Box>

        {/* Question Navigation */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {quiz.questions.map((_, index) => {
              const questionStatus = getAnswerStatus(quiz.questions[index]._id);
              const isActive = index === currentQuestionIndex;
              
              return (
                <Button
                  key={index}
                  variant={isActive ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleGoToQuestion(index)}
                  color={
                    questionStatus === 'correct'
                      ? 'success'
                      : questionStatus === 'incorrect'
                      ? 'error'
                      : 'default'
                  }
                >
                  {index + 1}
                </Button>
              );
            })}
          </Box>
        </Paper>

        {/* Current Question */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Question {currentQuestionIndex + 1}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentQuestion.text}
                  </Typography>
                  
                  {currentQuestion.type === 'multiple-choice' && (
                    <Box sx={{ mt: 2 }}>
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = userAnswer === index;
                        const isCorrect = option.isCorrect;
                        
                        return (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              mb: 1,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              bgcolor: isSelected
                                ? isCorrect
                                  ? 'success.light'
                                  : 'error.light'
                                : isCorrect
                                ? 'success.light'
                                : 'background.paper',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1">{option.text}</Typography>
                              {isSelected && (
                                <Chip
                                  label="Your Answer"
                                  size="small"
                                  color={isCorrect ? 'success' : 'error'}
                                />
                              )}
                              {isCorrect && !isSelected && (
                                <Chip
                                  label="Correct Answer"
                                  size="small"
                                  color="success"
                                />
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}

                  {currentQuestion.type === 'true-false' && (
                    <Box sx={{ mt: 2 }}>
                      {[true, false].map((value) => {
                        const isSelected = userAnswer === value;
                        const isCorrect = currentQuestion.correctAnswer === value;
                        
                        return (
                          <Box
                            key={value.toString()}
                            sx={{
                              p: 2,
                              mb: 1,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              bgcolor: isSelected
                                ? isCorrect
                                  ? 'success.light'
                                  : 'error.light'
                                : isCorrect
                                ? 'success.light'
                                : 'background.paper',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1">
                                {value ? 'True' : 'False'}
                              </Typography>
                              {isSelected && (
                                <Chip
                                  label="Your Answer"
                                  size="small"
                                  color={isCorrect ? 'success' : 'error'}
                                />
                              )}
                              {isCorrect && !isSelected && (
                                <Chip
                                  label="Correct Answer"
                                  size="small"
                                  color="success"
                                />
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}

                  {currentQuestion.type === 'short-answer' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Your Answer:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {userAnswer || 'Not answered'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Correct Answer:
                      </Typography>
                      <Typography variant="body1">
                        {currentQuestion.correctAnswer}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Explanation */}
                {currentQuestion.explanation && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Explanation
                    </Typography>
                    <Typography variant="body2">
                      {currentQuestion.explanation}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => printQuizResults(quiz, session, user)}
            >
              Print Quiz
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/quiz/${quizId}/results`)}
            >
              Back to Results
            </Button>
          </Box>
          <Button
            variant="outlined"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizReviewPage;
