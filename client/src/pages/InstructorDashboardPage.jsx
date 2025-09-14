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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const InstructorDashboardPage = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalContent: 0,
    connectedStudents: 0,
    pendingRequests: 0,
  });
  const [studentProgress, setStudentProgress] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, contentRes, progressRes, connectionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/quizzes/my-quizzes`),
        axios.get(`${API_BASE_URL}/content/my-content`),
        axios.get(`${API_BASE_URL}/content/progress/students`),
        axios.get(`${API_BASE_URL}/connections/pending-requests`)
      ]);

      const quizzes = quizzesRes.data;
      const content = contentRes.data;
      const progress = progressRes.data;
      const pendingRequests = connectionsRes.data;

      setStats({
        totalQuizzes: quizzes.length,
        totalContent: content.length,
        connectedStudents: progress.length,
        pendingRequests: pendingRequests.length,
      });

      setStudentProgress(progress);
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
    navigate('/manage-assignments');
  };

  const handleViewStudents = () => {
    navigate('/students');
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
                    <ListItem>
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
      </Paper>
    </Container>
  );
};

export default InstructorDashboardPage;
