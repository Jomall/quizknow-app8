import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Send,
  Flag,
} from '@mui/icons-material';

const QuizNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  onNext,
  onPrevious,
  onSubmit,
  isLastQuestion,
}) => {
  const handleFlagQuestion = () => {
    // TODO: Implement flagging functionality
    console.log('Flag question:', currentQuestionIndex);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
      <Box>
        <ButtonGroup variant="outlined">
          <Button
            onClick={onPrevious}
            disabled={currentQuestionIndex === 0}
            startIcon={<ArrowBack />}
          >
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={isLastQuestion}
            endIcon={<ArrowForward />}
          >
            Next
          </Button>
        </ButtonGroup>
      </Box>

      <Box>
        <Tooltip title="Flag this question for review">
          <IconButton onClick={handleFlagQuestion} color="warning">
            <Flag />
          </IconButton>
        </Tooltip>
      </Box>

      <Box>
        {isLastQuestion && (
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            endIcon={<Send />}
            size="large"
          >
            Submit Quiz
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default QuizNavigation;
