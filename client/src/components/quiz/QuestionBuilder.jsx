import React, { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import CustomDialog from '../common/CustomDialog';
import {
  Add,
  Delete,
  DragIndicator,
} from '@mui/icons-material';

const QuestionBuilder = ({ question, onSave, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(question || {
    type: 'multiple-choice',
    question: '',
    options: ['', ''],
    correctAnswer: '',
    points: 1,
    explanation: '',
    isRequired: true,
  });

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    handleQuestionChange('options', newOptions);
  };

  const handleAddOption = () => {
    handleQuestionChange('options', [...currentQuestion.options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    handleQuestionChange('options', newOptions);
  };

  const handleSave = () => {
    onSave(currentQuestion);
  };

  const renderQuestionType = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Multiple Choice Options
            </Typography>
            {currentQuestion.options.map((option, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  variant="outlined"
                />
                <IconButton onClick={() => handleRemoveOption(index)} disabled={currentQuestion.options.length <= 2}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={handleAddOption}
              disabled={currentQuestion.options.length >= 6}
            >
              Add Option
            </Button>

            <FormControl fullWidth margin="normal">
              <InputLabel>Correct Answer</InputLabel>
              <Select
                value={currentQuestion.correctAnswer}
                onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <MenuItem key={index} value={option} disabled={!option.trim()}>
                    {option || `Option ${index + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      case 'true-false':
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>Correct Answer</InputLabel>
            <Select
              value={currentQuestion.correctAnswer}
              onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
        );

      case 'short-answer':
        return (
          <TextField
            fullWidth
            label="Correct Answer (keywords)"
            value={currentQuestion.correctAnswer}
            onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
            margin="normal"
            helperText="Enter keywords separated by commas"
          />
        );

      case 'essay':
        return (
          <TextField
            fullWidth
            label="Rubric/Guidelines"
            value={currentQuestion.correctAnswer}
            onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
            margin="normal"
            multiline
            rows={3}
            helperText="Provide grading criteria or expected response structure"
          />
        );

      case 'fill-in-the-blank':
        return (
          <Box>
            <TextField
              fullWidth
              label="Question with blank"
              value={currentQuestion.question}
              onChange={(e) => handleQuestionChange('question', e.target.value)}
              margin="normal"
              helperText="Use [blank] to indicate where the blank should appear"
            />
            <TextField
              fullWidth
              label="Correct Answer"
              value={currentQuestion.correctAnswer}
              onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
              margin="normal"
            />
          </Box>
        );

      case 'select-all':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select All Options
            </Typography>
            {currentQuestion.options.map((option, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  variant="outlined"
                />
                <IconButton onClick={() => handleRemoveOption(index)} disabled={currentQuestion.options.length <= 2}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={handleAddOption}
              disabled={currentQuestion.options.length >= 6}
            >
              Add Option
            </Button>

            <TextField
              fullWidth
              label="Correct Answers (comma-separated)"
              value={Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.join(', ') : ''}
              onChange={(e) => handleQuestionChange('correctAnswer', e.target.value.split(',').map(s => s.trim()))}
              margin="normal"
              helperText="Enter correct options separated by commas"
            />
          </Box>
        );

      case 'matching':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Matching Pairs
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Terms</Typography>
                {currentQuestion.options.map((option, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    label={`Term ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    margin="normal"
                  />
                ))}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Definitions</Typography>
                {currentQuestion.correctAnswer.map((answer, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    label={`Definition ${index + 1}`}
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...currentQuestion.correctAnswer];
                      newAnswers[index] = e.target.value;
                      handleQuestionChange('correctAnswer', newAnswers);
                    }}
                    margin="normal"
                  />
                ))}
              </Grid>
            </Grid>
          </Box>
        );

      case 'ordering':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            {currentQuestion.options.map((option, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <DragIndicator sx={{ mr: 1 }} />
                <TextField
                  fullWidth
                  label={`Item ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  variant="outlined"
                />
                <IconButton onClick={() => handleRemoveOption(index)} disabled={currentQuestion.options.length <= 2}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={handleAddOption}
              disabled={currentQuestion.options.length >= 6}
            >
              Add Item
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <CustomDialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        {question ? 'Edit Question' : 'Add New Question'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Question Type</InputLabel>
              <Select
                value={currentQuestion.type}
                onChange={(e) => handleQuestionChange('type', e.target.value)}
              >
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
                <MenuItem value="short-answer">Short Answer</MenuItem>
                <MenuItem value="essay">Essay</MenuItem>
                <MenuItem value="fill-in-the-blank">Fill in the Blank</MenuItem>
                <MenuItem value="select-all">Select All That Apply</MenuItem>
                <MenuItem value="matching">Matching</MenuItem>
                <MenuItem value="ordering">Ordering</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Points"
              type="number"
              value={currentQuestion.points}
              onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
              margin="normal"
              inputProps={{ min: 1, max: 100 }}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Question"
          value={currentQuestion.question}
          onChange={(e) => handleQuestionChange('question', e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />

        {renderQuestionType()}

        <TextField
          fullWidth
          label="Explanation (optional)"
          value={currentQuestion.explanation}
          onChange={(e) => handleQuestionChange('explanation', e.target.value)}
          margin="normal"
          multiline
          rows={2}
          helperText="This will be shown to students after they answer"
        />

        <FormControlLabel
          control={
            <Switch
              checked={currentQuestion.isRequired}
              onChange={(e) => handleQuestionChange('isRequired', e.target.checked)}
            />
          }
          label="Required Question"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Question
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default QuestionBuilder;
