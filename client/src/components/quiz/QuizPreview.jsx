import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { CheckCircle, Cancel, People } from '@mui/icons-material';

const QuizPreview = ({ quizData, selectedStudents = [], onPublish }) => {
  const { title, description, category, difficulty, timeLimit, questions, settings } = quizData;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'true-false': return 'True/False';
      case 'short-answer': return 'Short Answer';
      case 'essay': return 'Essay';
      case 'fill-in-the-blank': return 'Fill in the Blank';
      case 'select-all': return 'Select All';
      case 'matching': return 'Matching';
      case 'ordering': return 'Ordering';
      default: return type;
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quiz Preview: {title}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <Chip label={category} variant="outlined" />
            <Chip
              label={difficulty}
              color={getDifficultyColor(difficulty)}
              variant="outlined"
            />
            <Chip label={`${timeLimit} minutes`} variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Quiz Settings
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Randomize Questions"
              secondary={settings.randomizeQuestions ? 'Yes' : 'No'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Show Correct Answers"
              secondary={settings.showCorrectAnswers ? 'Yes' : 'No'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Allow Multiple Attempts"
              secondary={settings.allowMultipleAttempts ? 'Yes' : 'No'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Passing Score"
              secondary={`${settings.passingScore}%`}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Selected Students Section */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <People />
          Assigned Students ({selectedStudents.length})
        </Typography>

        {selectedStudents.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No students selected. Quiz will be created but not assigned to any students.
          </Typography>
        ) : (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Quiz will be assigned to the following students:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {selectedStudents.map((studentId, index) => (
                <Chip
                  key={studentId}
                  label={`Student ${index + 1}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Questions ({questions.length})
        </Typography>

        {questions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No questions added yet.
          </Typography>
        ) : (
          <List>
            {questions.map((question, index) => (
              <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2">
                  Q{index + 1}: {question.question}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Chip
                    label={getQuestionTypeLabel(question.type)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${question.points} points`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {question.type === 'multiple-choice' && question.options && (
                  <Box sx={{ mt: 1, ml: 2 }}>
                    {question.options.map((option, optIndex) => (
                      <Box
                        key={optIndex}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: option === question.correctAnswer ? 'success.main' : 'text.primary'
                        }}
                      >
                        {option === question.correctAnswer ? (
                          <CheckCircle fontSize="small" color="success" />
                        ) : (
                          <Cancel fontSize="small" color="error" />
                        )}
                        <Typography variant="body2">{option}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {question.type === 'true-false' && (
                  <Box sx={{ mt: 1, ml: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {question.correctAnswer === 'true' ? (
                        <CheckCircle fontSize="small" color="success" />
                      ) : (
                        <Cancel fontSize="small" color="error" />
                      )}
                      <Typography variant="body2">True</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {question.correctAnswer === 'false' ? (
                        <CheckCircle fontSize="small" color="success" />
                      ) : (
                        <Cancel fontSize="small" color="error" />
                      )}
                      <Typography variant="body2">False</Typography>
                    </Box>
                  </Box>
                )}

                {(question.type === 'short-answer' || question.type === 'essay') && question.correctAnswer && (
                  <Box sx={{ mt: 1, ml: 2 }}>
                    <Typography variant="body2" color="success.main">
                      Correct answer: {question.correctAnswer}
                    </Typography>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default QuizPreview;
