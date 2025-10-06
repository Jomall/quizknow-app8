import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  VideoLibrary as VideoLibraryIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as PersonAddIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  ExpandMore as ExpandMoreIcon,
  Assessment as AssessmentIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConnectionRequests from '../components/common/ConnectionRequests';
import quizAPI from '../services/quizAPI';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const InstructorDashboardPage = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalContent: 0,
    connectedStudents: 0,
    assignedStudents: 0,
    pendingRequests: 0,
  });
  const [studentProgress, setStudentProgress] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [quizSubmissions, setQuizSubmissions] = useState({});
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
    // Set up polling to refresh dashboard data every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user.isApproved && activeTab === 3) {
      setActiveTab(0);
    }
  }, [user.isApproved, activeTab]);

  useEffect(() => {
    if (activeTab === 5) {
      loadQuizSubmissions();
    }
  }, [activeTab, recentQuizzes]);

  useEffect(() => {
    if (activeTab === 4) {
      loadAllAssignments();
      // Also refresh the main dashboard data to get latest quiz assignments
      loadDashboardData();
    }
  }, [activeTab]);

  const loadQuizSubmissions = async () => {
    try {
      const submissionsData = {};
      for (const quiz of recentQuizzes) {
        try {
          const response = await quizAPI.getQuizSubmissions(quiz._id);
          submissionsData[quiz._id] = response.data;
        } catch (error) {
          console.error(`Error loading submissions for quiz ${quiz._id}:`, error);
          submissionsData[quiz._id] = [];
        }
      }
      setQuizSubmissions(submissionsData);
    } catch (error) {
      console.error('Error loading quiz submissions:', error);
    }
  };

  const loadAllAssignments = async () => {
    try {
      setLoading(true);
      // Fetch all quizzes and content for managing assignments
      const [quizzesRes, contentRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/quizzes/my-quizzes`),
        axios.get(`${API_BASE_URL}/content/my-content`),
      ]);
      setAllQuizzes(quizzesRes.data);
      setAllContent(contentRes.data);
    } catch (error) {
      console.error('Error loading all assignments:', error);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const promises = [
        axios.get(`${API_BASE_URL}/quizzes/my-quizzes`),
        axios.get(`${API_BASE_URL}/content/my-content`),
        axios.get(`${API_BASE_URL}/content/progress/students`),
      ];

      if (user.isApproved) {
        promises.push(axios.get(`${API_BASE_URL}/connections/pending-requests`));
        promises.push(axios.get(`${API_BASE_URL}/connections/accepted-connections`));
      }

      const [quizzesRes, contentRes, progressRes, ...rest] = await Promise.all(promises);

      const quizzes = quizzesRes.data;
      const content = contentRes.data;
      const progress = progressRes.data;
      const pendingRequests = user.isApproved ? rest[0]?.data || [] : [];
      const acceptedConnections = user.isApproved ? rest[1]?.data || [] : [];

      setStats({
        totalQuizzes: quizzes.length,
        totalContent: content.length,
        connectedStudents: acceptedConnections.length,
        assignedStudents: progress.length,
        pendingRequests: pendingRequests.length,
      });

      setStudentProgress(progress.filter(p => p.student));
      setRecentQuizzes(quizzes.slice(0, 5));
      setRecentContent(content.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };

  const handleCreateContent = () => {
    navigate('/create-content');
  };

  const handleManageAssignments = () => {
    setActiveTab(4);
  };

  const handleViewStudents = () => {
    navigate('/students');
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        await quizAPI.deleteQuiz(quizId);
        loadDashboardData(); // Refresh the dashboard data
      } catch (error) {
        console.error('Error deleting quiz:', error);
        setError('Failed to delete quiz');
      }
    }
  };

  const handleClearSubmission = async (submissionId) => {
    if (window.confirm('Are you sure you want to clear this submission? The student will be able to retake the quiz.')) {
      try {
        console.log('Clearing submission:', submissionId);
        const response = await quizAPI.deleteSubmission(submissionId);
        console.log('Delete response:', response);
        loadQuizSubmissions(); // Refresh submissions data
        setError('');
      } catch (error) {
        console.error('Error clearing submission:', error);
        setError(`Failed to clear submission: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleClearSelectedSubmissions = async () => {
    if (selectedSubmissions.length === 0) return;

    const confirmMessage = `Are you sure you want to clear ${selectedSubmissions.length} submission${selectedSubmissions.length > 1 ? 's' : ''}? The students will be able to retake their quizzes.`;
    if (window.confirm(confirmMessage)) {
      try {
        await quizAPI.deleteSubmissionsBatch(selectedSubmissions);
        setSelectedSubmissions([]); // Clear selection
        loadQuizSubmissions(); // Refresh submissions data
        setError('');
      } catch (error) {
        console.error('Error clearing submissions:', error);
        setError(`Failed to clear submissions: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleMarkAsReviewed = async (submissionId) => {
    try {
      console.log('Marking submission as reviewed:', submissionId);
      const response = await quizAPI.markSubmissionReviewed(submissionId);
      console.log('Mark reviewed response:', response);
      loadQuizSubmissions(); // Refresh submissions data
      setError('');
    } catch (error) {
      console.error('Error marking submission as reviewed:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(`Failed to mark submission as reviewed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSelectSubmission = (submissionId) => {
    setSelectedSubmissions(prev =>
      prev.includes(submissionId)
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const handleSelectAllSubmissions = (quizId) => {
    const quizSubmissionIds = quizSubmissions[quizId]?.map(sub => sub._id) || [];
    const allSelected = quizSubmissionIds.every(id => selectedSubmissions.includes(id));

    if (allSelected) {
      // Deselect all for this quiz
      setSelectedSubmissions(prev =>
        prev.filter(id => !quizSubmissionIds.includes(id))
      );
    } else {
      // Select all for this quiz
      setSelectedSubmissions(prev => [
        ...prev.filter(id => !quizSubmissionIds.includes(id)),
        ...quizSubmissionIds
      ]);
    }
  };

  const getStatusIcon = (item, type) => {
    if (type === 'content') {
      if (item.isCompleted) return <CheckCircleIcon color="success" />;
      if (item.viewedAt) return <VisibilityIcon color="info" />;
      return <UncheckedIcon color="disabled" />;
    } else {
      // quiz
      if (item.isCompleted) return <CheckCircleIcon color="success" />;
      return <UncheckedIcon color="disabled" />;
    }
  };

  const getStatusText = (item, type) => {
    if (type === 'content') {
      if (item.isCompleted) return 'Completed';
      if (item.viewedAt) return 'Viewed';
      return 'Not Started';
    } else {
      if (item.isCompleted) return `Completed (${item.percentage}%)`;
      return 'Not Started';
    }
  };

  const renderStudentRow = (progress) => {
    const { student, contentViews, quizSubmissions } = progress;
    const totalAssignments = contentViews.length + quizSubmissions.length;
    const completedCount = [...contentViews, ...quizSubmissions].filter(item =>
      item.isCompleted || (item.viewedAt && !item.completedAt)
    ).length;

    return (
      <TableRow key={student._id}>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 2 }}>
              {student.profile?.firstName?.charAt(0) || student.username?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">
                {student.profile?.firstName} {student.profile?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {student.username}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>{totalAssignments}</TableCell>
        <TableCell>{completedCount}</TableCell>
        <TableCell>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {contentViews.map(view => (
              <Chip
                key={view._id}
                icon={getStatusIcon(view, 'content')}
                label={`${view.content.title} (${view.content.type})`}
                size="small"
                color={view.isCompleted ? 'success' : view.viewedAt ? 'info' : 'default'}
                variant="outlined"
              />
            ))}
            {quizSubmissions.map(sub => (
              <Chip
                key={sub._id}
                icon={getStatusIcon(sub, 'quiz')}
                label={`${sub.quiz.title} (${getStatusText(sub, 'quiz')})`}
                size="small"
                color={sub.isCompleted ? 'success' : 'default'}
                variant="outlined"
              />
            ))}
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  const renderManageAssignmentsTab = () => (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Quiz Assignments
        </Typography>
        <Button variant="outlined" size="small" onClick={() => { loadAllAssignments(); loadDashboardData(); }}>
          Refresh
        </Button>
      </Box>
      {allQuizzes.length > 0 ? allQuizzes.map(quiz => (
        <Card key={quiz._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{quiz.title}</Typography>
            <Typography variant="body2" color="text.secondary">Assigned Students:</Typography>
            {quiz.students && quiz.students.length > 0 ? (
              quiz.students.map(s => {
                const student = s.student;
                if (!student) return null;
                const isSubmitted = s.submittedAt !== undefined && s.submittedAt !== null;
                return (
                  <Box key={student._id} display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                    <Typography>{student.profile?.firstName} {student.profile?.lastName} ({student.username})</Typography>
                    <Chip label={isSubmitted ? 'Submitted' : 'Not Submitted'} color={isSubmitted ? 'success' : 'default'} size="small" />
                  </Box>
                );
              }).filter(Boolean)
            ) : (
              <Typography variant="body2" color="text.secondary">No students assigned</Typography>
            )}
          </CardContent>
        </Card>
      )) : (
        <Typography variant="body2" color="text.secondary">No quizzes available</Typography>
      )}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Content Assignments
      </Typography>
      {recentContent.map(content => (
        <Card key={content._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{content.title} ({content.type})</Typography>
            <Typography variant="body2" color="text.secondary">Assigned Students:</Typography>
            {content.allowedStudents && content.allowedStudents.length > 0 ? (
              content.allowedStudents.map(student => {
                if (!student) return null;
                const progress = studentProgress.find(p => p.student && p.student._id === student._id);
                const view = progress?.contentViews.find(v => v.content._id === content._id);
                return (
                  <Box key={student._id} display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                    <Typography>{student.profile?.firstName} {student.profile?.lastName} ({student.username})</Typography>
                    <Chip label={view ? (view.isCompleted ? 'Completed' : 'Viewed') : 'Not Started'} color={view?.isCompleted ? 'success' : view?.viewedAt ? 'info' : 'default'} size="small" />
                  </Box>
                );
              }).filter(Boolean)
            ) : (
              <Typography variant="body2" color="text.secondary">No students assigned</Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderReviewSubmissionsTab = () => {
    const totalSelected = selectedSubmissions.length;
    const hasSubmissions = recentQuizzes.some(quiz => quizSubmissions[quiz._id]?.length > 0);

    return (
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Quiz Submissions for Review
          </Typography>
          {totalSelected > 0 && (
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearSelectedSubmissions}
            >
              Clear Selected ({totalSelected})
            </Button>
          )}
        </Box>
        {recentQuizzes.length > 0 ? (
          recentQuizzes.map(quiz => {
            const submissions = quizSubmissions[quiz._id] || [];
            const quizSubmissionIds = submissions.map(sub => sub._id);
            const selectedForQuiz = quizSubmissionIds.filter(id => selectedSubmissions.includes(id)).length;
            const allSelected = submissions.length > 0 && selectedForQuiz === submissions.length;

            return (
              <Accordion key={quiz._id} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`quiz-${quiz._id}-content`}
                  id={`quiz-${quiz._id}-header`}
                >
                  <Box display="flex" alignItems="center" width="100%">
                    <AssessmentIcon sx={{ mr: 2 }} />
                    <Box flexGrow={1}>
                      <Typography variant="h6">{quiz.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {quiz.questions?.length || 0} questions • {submissions.length} submissions
                      </Typography>
                    </Box>
                    {submissions.length > 0 && (
                      <Box display="flex" alignItems="center" mr={2}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAllSubmissions(quiz._id);
                          }}
                        >
                          {allSelected ? (
                            <CheckBoxIcon color="primary" />
                          ) : selectedForQuiz > 0 ? (
                            <CheckBoxOutlineBlankIcon color="primary" />
                          ) : (
                            <CheckBoxOutlineBlankIcon />
                          )}
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {selectedForQuiz}/{submissions.length} selected
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle1" gutterBottom>
                    Student Submissions:
                  </Typography>
                  {submissions.length > 0 ? (
                    submissions.map(submission => {
                      const isSelected = selectedSubmissions.includes(submission._id);
                      return (
                        <Card key={submission._id} sx={{ mb: 1 }}>
                          <CardContent sx={{ pb: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Box display="flex" alignItems="center">
                                <IconButton
                                  size="small"
                                  onClick={() => handleSelectSubmission(submission._id)}
                                  sx={{ mr: 1 }}
                                >
                                  {isSelected ? (
                                    <CheckBoxIcon color="primary" />
                                  ) : (
                                    <CheckBoxOutlineBlankIcon />
                                  )}
                                </IconButton>
                                <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                  {submission.student.profile?.firstName?.charAt(0) || submission.student.username?.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2">
                                    {submission.student.profile?.firstName} {submission.student.profile?.lastName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {submission.student.username}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Box textAlign="right">
                                  <Typography variant="body2" color="text.secondary">Score</Typography>
                                  <Typography variant="h6" color={submission.percentage >= 60 ? 'success.main' : 'error.main'}>
                                    {submission.percentage}%
                                  </Typography>
                                  {submission.reviewedAt && (
                                    <Chip label="Reviewed" color="success" size="small" sx={{ mt: 0.5 }} />
                                  )}
                                </Box>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => navigate(`/quiz/${quiz._id}/submission/${submission._id}/review`)}
                                >
                                  Review
                                </Button>
                                {!submission.reviewedAt && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleMarkAsReviewed(submission._id)}
                                  >
                                    Mark Reviewed
                                  </Button>
                                )}
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleClearSubmission(submission._id)}
                                  title="Clear submission"
                                >
                                  <ClearIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Submitted: {new Date(submission.submittedAt).toLocaleString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No submissions yet
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No quizzes available
          </Typography>
        )}
      </Box>
    );
  };

  const renderOverviewTab = () => (
    <Box sx={{ p: 3 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">My Quizzes</Typography>
              </Box>
              <Typography variant="h4" color="primary">{stats.totalQuizzes}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <VideoLibraryIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">My Content</Typography>
              </Box>
              <Typography variant="h4" color="secondary">{stats.totalContent}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <SchoolIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Assigned Students</Typography>
              </Box>
              <Typography variant="h4" color="success.main">{stats.assignedStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Connected Students</Typography>
              </Box>
              <Typography variant="h4" color="info.main">{stats.connectedStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PersonAddIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Pending Requests</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">{stats.pendingRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AddIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Create Quiz</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create a new quiz for your students
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" fullWidth onClick={handleCreateQuiz}>
                Create Quiz
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <VideoLibraryIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Create Content</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload videos, documents, or links
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" fullWidth onClick={handleCreateContent}>
                Create Content
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonAddIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Assignments</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Assign quizzes and content to students
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" fullWidth onClick={handleManageAssignments}>
                Manage
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">View Students</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                See all connected students
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" fullWidth onClick={handleViewStudents}>
                View Students
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Quizzes</Typography>
              <Button variant="outlined" size="small" onClick={() => navigate('/quizzes')}>
                View All
              </Button>
            </Box>
            <List>
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <React.Fragment key={quiz._id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteQuiz(quiz._id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={quiz.title}
                        secondary={`${quiz.questions?.length || 0} questions • ${new Date(quiz.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No quizzes created yet
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Content</Typography>
              <Button variant="outlined" size="small" onClick={() => navigate('/content')}>
                View All
              </Button>
            </Box>
            <List>
              {recentContent.length > 0 ? (
                recentContent.map((content) => (
                  <React.Fragment key={content._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <VideoLibraryIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={content.title}
                        secondary={`${content.type} • ${new Date(content.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No content created yet
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.profile?.firstName || user?.username || 'Instructor'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your quizzes, content, and track student progress.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Student Progress" />
            <Tab label="Detailed View" />
            {user.isApproved && <Tab label="Connection Requests" />}
            <Tab label="Manage Assignments" />
            <Tab label="Review Submissions" />
          </Tabs>
        </Box>

        {activeTab === 0 && renderOverviewTab()}

        {activeTab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Total Assignments</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentProgress.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                        No students assigned to your content yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  studentProgress.map(renderStudentRow)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Progress View
            </Typography>
            {studentProgress.map(progress => (
              <Card key={progress.student._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2 }}>
                      {progress.student.profile?.firstName?.charAt(0) || progress.student.username?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6">
                      {progress.student.profile?.firstName} {progress.student.profile?.lastName} ({progress.student.username})
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1" gutterBottom>
                    Content Progress:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {progress.contentViews.map(view => (
                      <Chip
                        key={view._id}
                        icon={getStatusIcon(view, 'content')}
                        label={`${view.content.title} - ${getStatusText(view, 'content')}`}
                        size="small"
                        color={view.isCompleted ? 'success' : view.viewedAt ? 'info' : 'default'}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle1" gutterBottom>
                    Quiz Progress:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {progress.quizSubmissions.map(sub => (
                      <Chip
                        key={sub._id}
                        icon={getStatusIcon(sub, 'quiz')}
                        label={`${sub.quiz.title} - ${getStatusText(sub, 'quiz')}`}
                        size="small"
                        color={sub.isCompleted ? 'success' : 'default'}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {activeTab === 3 && <ConnectionRequests onRequestProcessed={loadDashboardData} />}

        {activeTab === 4 && renderManageAssignmentsTab()}

        {activeTab === 5 && renderReviewSubmissionsTab()}
      </Paper>
    </Container>
  );
};

export default InstructorDashboardPage;
