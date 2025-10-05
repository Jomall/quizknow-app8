import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
  AccessTime as TimeIcon,
  Score as ScoreIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import QuizResults from '../components/quiz/QuizResults';
import LoadingSpinner from '../components/common/LoadingSpinner';

const QuizResultsPage = () => {
  const { quizId, sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getSubmittedQuizzes, getQuizResults } = useQuiz();

  const [session, setSession] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResults();
  }, [quizId, sessionId]);

  const loadResults = async () => {
    try {
      setLoading(true);

      if (sessionId) {
        // Fetch specific quiz results by sessionId
        const results = await getQuizResults(quizId, sessionId);
        setSession(results.session);
        setQuiz(results.quiz);
      } else {
        // Fallback to finding latest submission for this quiz
        const submissions = await getSubmittedQuizzes();

        if (!submissions || submissions.length === 0) {
          setError('No completed quiz sessions found. You may not have taken any quizzes yet.');
          return;
        }

        // Find the latest submission for this quiz
        const submission = submissions
          .filter(s => s.quiz && s.quiz._id && s.quiz._id.toString() === quizId.toString())
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];

        if (submission) {
          setSession(submission);
          setQuiz(submission.quiz);
        } else {
          setError(`No results found for this quiz. You may not have completed this quiz yet, or the quiz data is unavailable.`);
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view these quiz results.');
      } else if (error.response?.status === 404) {
        setError('Quiz results not found.');
      } else if (error.response?.status === 500) {
        setError('Server error occurred while loading quiz results. Please try again later.');
      } else {
        setError(error.message || 'Failed to load quiz results. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    if (!session || !quiz) return 0;
    const correctAnswers = session.answers.filter(
      (answer) => answer.isCorrect
    ).length;
    return Math.round((correctAnswers / quiz.questionCount) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  if (!session || !quiz) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="info">Quiz results not found</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  const score = calculateScore();
  const correctAnswers = session.answers.filter(a => a.isCorrect).length;
  const totalQuestions = quiz.questionCount;
  const passingScore = quiz.settings?.passingScore || 70;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Quiz Results
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Score Summary */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Overall Score
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Typography variant="h2" color={getScoreColor(score)}>
                  {score}%
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {correctAnswers} out of {totalQuestions} questions correct
              </Typography>
              <Chip
                label={score >= passingScore ? 'Passed' : 'Failed'}
                color={score >= passingScore ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            </Paper>
          </Grid>

          {/* Time & Stats */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quiz Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon color="primary" />
                  <Typography>
                    Time Taken: {formatTime(session.timeSpent)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScoreIcon color="primary" />
                  <Typography>
                    Passing Score: {passingScore}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon color="success" />
                  <Typography>
                    Correct Answers: {correctAnswers}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WrongIcon color="error" />
                  <Typography>
                    Incorrect Answers: {totalQuestions - correctAnswers}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Question Breakdown */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Question Breakdown
              </Typography>
              <List>
                {quiz.questions.map((question, index) => {
                  const answer = session.answers.find(a => a.questionId === question._id.toString());
                  const isCorrect = answer?.isCorrect || false;

                  return (
                    <React.Fragment key={question._id}>
                      <ListItem>
                        <ListItemIcon>
                          {isCorrect ? (
                            <CheckIcon color="success" />
                          ) : (
                            <WrongIcon color="error" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={`Question ${index + 1}`}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {question.question.substring(0, 100)}...
                              </Typography>
                              <Typography variant="caption" color={isCorrect ? 'success.main' : 'error.main'}>
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < quiz.questions.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/quiz/${quizId}/review`)}
              >
                Review Answers
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/quiz/${quizId}/retake`)}
                disabled={!(quiz.settings?.allowMultipleAttempts || false)}
              >
                Retake Quiz
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/browse-quizzes')}
              >
                Browse More Quizzes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default QuizResultsPage;
