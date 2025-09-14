import React, { createContext, useContext, useReducer, useEffect } from 'react';
import quizAPI from '../services/quizAPI';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const QuizContext = createContext();

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_QUIZZES: 'SET_QUIZZES',
  SET_CURRENT_QUIZ: 'SET_CURRENT_QUIZ',
  SET_SESSION: 'SET_SESSION',
  UPDATE_ANSWER: 'UPDATE_ANSWER',
  SET_PROGRESS: 'SET_PROGRESS',
  SET_TIME_REMAINING: 'SET_TIME_REMAINING',
  COMPLETE_QUIZ: 'COMPLETE_QUIZ',
};

// Initial state
const initialState = {
  quizzes: [],
  currentQuiz: null,
  session: null,
  answers: {},
  progress: 0,
  timeRemaining: 0,
  loading: false,
  error: null,
  completed: false,
};

// Reducer
const quizReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_QUIZZES:
      return { ...state, quizzes: action.payload, loading: false };
    case ACTIONS.SET_CURRENT_QUIZ:
      return { ...state, currentQuiz: action.payload, loading: false };
    case ACTIONS.SET_SESSION:
      return { ...state, session: action.payload, loading: false };
    case ACTIONS.UPDATE_ANSWER:
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    case ACTIONS.SET_PROGRESS:
      return { ...state, progress: action.payload };
    case ACTIONS.SET_TIME_REMAINING:
      return { ...state, timeRemaining: action.payload };
    case ACTIONS.COMPLETE_QUIZ:
      return { ...state, completed: true, loading: false };
    default:
      return state;
  }
};

// Provider component
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Actions
  const fetchQuizzes = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await quizAPI.getAllQuizzes();
      dispatch({ type: ACTIONS.SET_QUIZZES, payload: response.data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const fetchQuiz = async (quizId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await quizAPI.getQuizById(quizId);
      dispatch({ type: ACTIONS.SET_CURRENT_QUIZ, payload: response.data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const startQuiz = async (quizId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await quizAPI.startQuizSession(quizId);
      dispatch({ type: ACTIONS.SET_SESSION, payload: response.data });
      dispatch({ type: ACTIONS.SET_TIME_REMAINING, payload: response.data.timeRemaining });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const updateAnswer = async (questionId, answer) => {
    dispatch({ type: ACTIONS.UPDATE_ANSWER, payload: { questionId, answer } });
    
    if (state.session) {
      try {
        await quizAPI.updateAnswer(
          state.currentQuiz._id,
          state.session._id,
          questionId,
          answer
        );
      } catch (error) {
        console.error('Failed to update answer:', error);
      }
    }
  };

  const submitQuiz = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const answersArray = Object.entries(state.answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      await quizAPI.submitQuiz(
        state.currentQuiz._id,
        state.session._id,
        answersArray
      );

      dispatch({ type: ACTIONS.COMPLETE_QUIZ });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const getInstructorQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/quizzes/my-quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor quizzes:', error);
      return [];
    }
  };

  const getInstructorStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor stats:', error);
      return {
        totalQuizzes: 0,
        totalStudents: 0,
        averageScore: 0,
        completionRate: 0,
      };
    }
  };

  const createQuiz = async (quizData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/quizzes`, quizData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    fetchQuizzes,
    fetchQuiz,
    startQuiz,
    updateAnswer,
    submitQuiz,
    getInstructorQuizzes,
    getInstructorStats,
    createQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

// Custom hook
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
