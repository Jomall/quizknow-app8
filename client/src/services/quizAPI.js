import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const quizAPI = {
  // Quiz endpoints
  getAllQuizzes: () => axios.get(`${API_BASE_URL}/quizzes`),
  getQuizById: (id) => axios.get(`${API_BASE_URL}/quizzes/${id}`),
  createQuiz: (quizData) => axios.post(`${API_BASE_URL}/quizzes`, quizData),
  updateQuiz: (id, quizData) => axios.put(`${API_BASE_URL}/quizzes/${id}`, quizData),
  deleteQuiz: (id) => axios.delete(`${API_BASE_URL}/quizzes/${id}`),
  publishQuiz: (id, studentIds) => axios.post(`${API_BASE_URL}/quizzes/${id}/publish`, { studentIds }),

  // Quiz session endpoints
  startQuizSession: (quizId) => axios.post(`${API_BASE_URL}/quiz/${quizId}/start`),
  submitQuiz: (quizId, sessionId, answers) => axios.post(`${API_BASE_URL}/quiz/${quizId}/submit`, { sessionId, answers }),
  getSessionDetails: (quizId, sessionId) => axios.get(`${API_BASE_URL}/quiz/${quizId}/session/${sessionId}`),
  updateAnswer: (quizId, sessionId, questionId, answer) => axios.put(`${API_BASE_URL}/quiz/${quizId}/session/${sessionId}/answer`, { questionId, answer }),
  getProgress: (quizId, sessionId) => axios.get(`${API_BASE_URL}/quiz/${quizId}/session/${sessionId}/progress`),
};

export default quizAPI;
