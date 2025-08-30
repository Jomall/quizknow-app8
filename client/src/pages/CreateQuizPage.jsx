import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import QuizCreator from '../components/quiz/QuizCreator';
import QuestionBuilder from '../components/quiz/QuestionBuilder';
import QuizPreview from '../components/quiz/QuizPreview';

const steps = ['Basic Info', 'Add Questions', 'Preview & Publish'];

const CreateQuizPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    timeLimit: 30,
    questions: [],
    settings: {
      randomizeQuestions: false,
      showCorrectAnswers: true,
      allowMultipleAttempts: true,
      passingScore: 70,
    },
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createQuiz } = useQuiz();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleQuizDataChange = (newData) => {
    setQuizData({ ...quizData, ...newData });
  };

  const handleQuestionsChange = (questions) => {
    setQuizData({ ...quizData, questions });
  };

  const handlePublish = async () => {
    try {
      await createQuiz(quizData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <QuizCreator
            quizData={quizData}
            onChange={handleQuizDataChange}
          />
        );
      case 1:
        return (
          <QuestionBuilder
            questions={quizData.questions}
            onChange={handleQuestionsChange}
          />
        );
      case 2:
        return (
          <QuizPreview
            quizData={quizData}
            onPublish={handlePublish}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Quiz
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Build an engaging quiz for your students in just a few steps.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, mb: 1 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handlePublish}
              disabled={quizData.questions.length === 0}
            >
              Publish Quiz
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !quizData.title) ||
                (activeStep === 1 && quizData.questions.length === 0)
              }
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateQuizPage;
