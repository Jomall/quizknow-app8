import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  Replay,
  Share,
  Print,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuizResults = ({ results, quiz, onRetake, onClose }) => {
  const navigate = useNavigate();

  if (!results || !quiz) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6">No results available</Typography>
      </Box>
    );
  }

  const {
    score,
    totalQuestions,
    percentage,
    answers,
    timeSpent,
    completedAt,
    questionResults,
  } = results;

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A', color: 'success' };
    if (percentage >= 80) return { grade: 'B', color: 'primary' };
    if (percentage >= 70) return { grade: 'C', color: 'warning' };
    if (percentage >= 60) return { grade: 'D', color: 'warning' };
    return { grade: 'F', color: 'error' };
  };

  const grade = getGrade(percentage);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShareResults = () => {
    const shareText = `I scored ${percentage}% on "${quiz.title}"!`;
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Results',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handlePrintResults = () => {
    window.print();
  };

  return (
    <Box p={3} maxWidth="md" mx="auto">
      <Card>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" gutterBottom>
              Quiz Complete!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {quiz.title}
            </Typography>
          </Box>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 1,
                    bgcolor: `${grade.color}.main`,
                  }}
                >
                  <Typography variant="h4">{grade.grade}</Typography>
                </Avatar>
                <Typography variant="h5">{percentage}%</Typography>
                <Typography variant="body2" color="text.secondary">
                  {score} / {totalQuestions} correct
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Quiz Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Time Spent
                    </Typography>
                    <Typography variant="h6">{formatTime(timeSpent)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="h6">
                      {new Date(completedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Difficulty
                    </Typography>
                    <Typography variant="h6">{quiz.difficulty || 'Medium'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Subject
                    </Typography>
                    <Typography variant="h6">{quiz.subject}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Performance Breakdown
            </Typography>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2">0%</Typography>
              <Typography variant="body2">100%</Typography>
            </Box>
          </Box>

          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Question Review
            </Typography>
            <List>
              {questionResults.map((result, index) => {
                const question = quiz.questions[index];
                return (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box display="flex" alignItems="center" width="100%">
                        <ListItemIcon>
                          {result.isCorrect ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Cancel color="error" />
                          )}
                        </ListItemIcon>
                        <Box flexGrow={1}>
                          <Typography variant="body2">
                            Question {index + 1}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {result.points} points
                          </Typography>
                        </Box>
                        <Chip
                          label={`${result.pointsEarned}/${result.points}`}
                          size="small"
                          color={result.isCorrect ? 'success' : 'error'}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          <strong>Question:</strong> {question.question}
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Your Answer:</strong> {result.userAnswer || 'Not answered'}
                        </Typography>
                        
                        {!result.isCorrect && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Correct Answer:</strong> {question.correctAnswer}
                          </Typography>
                        )}
                        
                        {question.explanation && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Explanation:</strong> {question.explanation}
                          </Typography>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Replay />}
              onClick={onRetake}
            >
              Retake Quiz
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShareResults}
            >
              Share Results
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrintResults}
            >
              Print Results
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Close
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuizResults;
