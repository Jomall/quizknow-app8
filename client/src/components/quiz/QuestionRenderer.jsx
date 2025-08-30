import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  TextField,
  FormControl,
  FormLabel,
  Chip,
  Grid,
} from '@mui/material';

const QuestionRenderer = ({ question, questionIndex, totalQuestions, currentAnswer, onAnswerChange }) => {
  const handleAnswerChange = (value) => {
    onAnswerChange(question._id, value);
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.question}</FormLabel>
            <RadioGroup
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'short-answer':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {question.question}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Enter your answer here..."
            />
          </Box>
        );

      case 'select-all':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.question}</FormLabel>
            <FormGroup>
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={currentAnswer?.includes(option) || false}
                      onChange={(e) => {
                        const newAnswer = e.target.checked
                          ? [...(currentAnswer || []), option]
                          : (currentAnswer || []).filter(item => item !== option);
                        handleAnswerChange(newAnswer);
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
        );

      case 'fill-in-the-blank':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {question.question}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Fill in the blank..."
            />
          </Box>
        );

      case 'essay':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {question.question}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Write your essay here..."
            />
          </Box>
        );

      case 'true-false':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.question}</FormLabel>
            <RadioGroup
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value === 'true')}
            >
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
          </FormControl>
        );

      case 'matching':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {question.question}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Items to Match:
                </Typography>
                {question.leftItems.map((item, index) => (
                  <Box key={index} mb={1}>
                    <Chip label={item} />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Match with:
                </Typography>
                {question.rightItems.map((item, index) => (
                  <Box key={index} mb={1}>
                    <TextField
                      select
                      label={`Match ${item}`}
                      value={currentAnswer?.[item] || ''}
                      onChange={(e) => {
                        const newAnswer = { ...(currentAnswer || {}), [item]: e.target.value };
                        handleAnswerChange(newAnswer);
                      }}
                      SelectProps={{ native: true }}
                      fullWidth
                    >
                      <option value="">Select match</option>
                      {question.leftItems.map((leftItem, leftIndex) => (
                        <option key={leftIndex} value={leftItem}>
                          {leftItem}
                        </option>
                      ))}
                    </TextField>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Box>
        );

      case 'ordering':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {question.question}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Drag and drop to reorder the items correctly
            </Typography>
            {question.items.map((item, index) => (
              <Box key={index} mb={1}>
                <TextField
                  type="number"
                  label={`Position for: ${item}`}
                  value={currentAnswer?.[item] || ''}
                  onChange={(e) => {
                    const newAnswer = { ...(currentAnswer || {}), [item]: parseInt(e.target.value) };
                    handleAnswerChange(newAnswer);
                  }}
                  inputProps={{ min: 1, max: question.items.length }}
                  fullWidth
                />
              </Box>
            ))}
          </Box>
        );

      default:
        return (
          <Typography variant="body1">
            Unknown question type: {question.type}
          </Typography>
        );
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Question {questionIndex + 1} of {totalQuestions}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Type: {question.type}
      </Typography>
      {question.points && (
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Points: {question.points}
        </Typography>
      )}
      <Box mt={2}>
        {renderQuestionType()}
      </Box>
    </Box>
  );
};

export default QuestionRenderer;
