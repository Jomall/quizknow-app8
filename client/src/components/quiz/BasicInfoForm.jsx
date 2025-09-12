import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

const BasicInfoForm = ({ quizData, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...quizData, [field]: value });
  };

  const categories = [
    'General',
    'Mathematics',
    'Science',
    'History',
    'Literature',
    'Computer Science',
    'Languages',
    'Arts',
    'Other',
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Basic Quiz Information
      </Typography>

      <TextField
        fullWidth
        label="Quiz Title"
        value={quizData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        margin="normal"
        required
        helperText="Enter a descriptive title for your quiz"
      />

      <TextField
        fullWidth
        label="Description"
        value={quizData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        margin="normal"
        multiline
        rows={3}
        helperText="Provide a brief description of what the quiz covers"
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={quizData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category.toLowerCase()}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={quizData.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
          >
            {difficulties.map(diff => (
              <MenuItem key={diff.value} value={diff.value}>
                {diff.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        label="Time Limit (minutes)"
        type="number"
        value={quizData.timeLimit}
        onChange={(e) => handleChange('timeLimit', parseInt(e.target.value) || 30)}
        margin="normal"
        inputProps={{ min: 1, max: 180 }}
        helperText="Set the time limit for completing the quiz (1-180 minutes)"
      />
    </Box>
  );
};

export default BasicInfoForm;
