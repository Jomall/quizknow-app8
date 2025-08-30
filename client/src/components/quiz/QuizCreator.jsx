import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Publish,
} from '@mui/icons-material';
import QuestionBuilder from './QuestionBuilder';

const QuizCreator = () => {
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    subject: '',
    gradeLevel: '',
    timeLimit: 30,
    isPublished: false,
    questions: [],
    settings: {
      randomizeQuestions: false,
      showResults: true,
      allowMultipleAttempts: false,
      passingScore: 70,
    },
  });

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  const handleQuizChange = (field, value) => {
    setQuiz(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingsChange = (field, value) => {
    setQuiz(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  const handleAddQuestion = () => {
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', ''],
      correctAnswer: '',
      points: 1,
    });
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestion(quiz.questions[index]);
    setEditingQuestionIndex(index);
  };

  const handleSaveQuestion = (question) => {
    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...quiz.questions];
      updatedQuestions[editingQuestionIndex] = question;
      setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
    } else {
      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, question],
      }));
    }
    setCurrentQuestion(null);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (index) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSaveQuiz = async () => {
    try {
      // TODO: Implement save functionality
      console.log('Saving quiz:', quiz);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handlePublishQuiz = async () => {
    try {
      // TODO: Implement publish functionality
      console.log('Publishing quiz:', quiz);
    } catch (error) {
      console.error('Error publishing quiz:', error);
    }
  };

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'select-all', label: 'Select All That Apply' },
    { value: 'fill-in-the-blank', label: 'Fill in the Blank' },
    { value: 'essay', label: 'Essay' },
    { value: 'true-false', label: 'True/False' },
    { value: 'matching', label: 'Matching' },
    { value: 'ordering', label: 'Ordering' },
  ];

  const gradeLevels = [
    'Elementary (K-5)',
    'Middle School (6-8)',
    'High School (9-12)',
    'College',
    'Professional',
  ];

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Languages',
    'Arts',
    'Physical Education',
    'Other',
  ];

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Create New Quiz
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Quiz Title"
                value={quiz.title}
                onChange={(e) => handleQuizChange('title', e.target.value)}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Description"
                value={quiz.description}
                onChange={(e) => handleQuizChange('description', e.target.value)}
                margin="normal"
                multiline
                rows={3}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={quiz.subject}
                      onChange={(e) => handleQuizChange('subject', e.target.value)}
                    >
                      {subjects.map(subject => (
                        <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Grade Level</InputLabel>
                    <Select
                      value={quiz.gradeLevel}
                      onChange={(e) => handleQuizChange('gradeLevel', e.target.value)}
                    >
                      {gradeLevels.map(level => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Time Limit (minutes)"
                type="number"
                value={quiz.timeLimit}
                onChange={(e) => handleQuizChange('timeLimit', parseInt(e.target.value))}
                margin="normal"
                inputProps={{ min: 1, max: 180 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quiz Settings
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={quiz.settings.randomizeQuestions}
                    onChange={(e) => handleSettingsChange('randomizeQuestions', e.target.checked)}
                  />
                }
                label="Randomize Questions"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={quiz.settings.showResults}
                    onChange={(e) => handleSettingsChange('showResults', e.target.checked)}
                  />
                }
                label="Show Results After Completion"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={quiz.settings.allowMultipleAttempts}
                    onChange={(e) => handleSettingsChange('allowMultipleAttempts', e.target.checked)}
                  />
                }
                label="Allow Multiple Attempts"
              />

              <TextField
                fullWidth
                label="Passing Score (%)"
                type="number"
                value={quiz.settings.passingScore}
                onChange={(e) => handleSettingsChange('passingScore', parseInt(e.target.value))}
                margin="normal"
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">
              Questions ({quiz.questions.length})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddQuestion}
            >
              Add Question
            </Button>
          </Box>

          <Box mb={3}>
            {quiz.questions.map((question, index) => (
              <Box key={index} mb={2} p={2} border={1} borderColor="divider" borderRadius={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">
                    {index + 1}. {question.question.substring(0, 50)}...
                  </Typography>
                  <Box>
                    <Chip label={`${question.points} pts`} size="small" sx={{ mr: 1 }} />
                    <Chip label={question.type} size="small" sx={{ mr: 1 }} />
                    <IconButton onClick={() => handleEditQuestion(index)} size="small">
                      <Typography variant="body2" color="primary">Edit</Typography>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteQuestion(index)} size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={handleSaveQuiz}
              disabled={quiz.questions.length === 0}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Publish />}
              onClick={handlePublishQuiz}
              disabled={quiz.questions.length === 0 || !quiz.title}
            >
              Publish Quiz
            </Button>
          </Box>
        </CardContent>
      </Card>

      {currentQuestion && (
        <QuestionBuilder
          question={currentQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => {
            setCurrentQuestion(null);
            setEditingQuestionIndex(null);
          }}
        />
      )}
    </Box>
  );
};

export default QuizCreator;
