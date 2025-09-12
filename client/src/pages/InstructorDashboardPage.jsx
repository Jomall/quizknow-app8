import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Fab,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  MoreVert as MoreVertIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Audiotrack as AudiotrackIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import axios from 'axios';
import ConnectionRequests from '../components/common/ConnectionRequests';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const InstructorDashboardPage = () => {
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [myContent, setMyContent] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalStudents: 0,
    averageScore: 0,
    completionRate: 0,
  });
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getInstructorQuizzes, getInstructorStats } = useQuiz();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [quizzes, statsData, content] = await Promise.all([
        getInstructorQuizzes(),
        getInstructorStats(),
        fetchMyContent(),
      ]);
      setMyQuizzes(quizzes.slice(0, 5));
      setStats(statsData);
      setMyContent(content.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const fetchMyContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/content/my-content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    }
  };

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };

  const handleCreateContent = () => {
    navigate('/create-content');
  };

  const handleViewQuiz = (quizId) => {
    navigate(`/quiz-review/${quizId}`);
  };

  const handleViewContent = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <VideoLibraryIcon />;
      case 'document': return <DescriptionIcon />;
      case 'image': return <ImageIcon />;
      case 'audio': return <AudiotrackIcon />;
      case 'link': return <LinkIcon />;
      default: return <DescriptionIcon />;
    }
  };

  const getContentTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

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

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  My Quizzes
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {stats.totalQuizzes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="success" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Total Students
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {stats.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="info" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Avg Score
                </Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                {stats.averageScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="secondary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Completion Rate
                </Typography>
              </Box>
              <Typography variant="h3" color="secondary.main">
                {stats.completionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Content Tabs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
              <Tab label="My Quizzes" />
              <Tab label="My Content" />
            </Tabs>

            {activeTab === 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">My Quizzes</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/quizzes')}
                  >
                    View All
                  </Button>
                </Box>
                <List>
                  {myQuizzes.length > 0 ? (
                    myQuizzes.map((quiz) => (
                      <React.Fragment key={quiz._id}>
                        <ListItem
                          secondaryAction={
                            <IconButton onClick={() => handleViewQuiz(quiz._id)}>
                              <MoreVertIcon />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {quiz.title.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={quiz.title}
                            secondary={`${quiz.questions?.length || 0} questions • Created: ${new Date(quiz.createdAt).toLocaleDateString()}`}
                          />
                          <Chip
                            label={`${quiz.attempts || 0} attempts`}
                            size="small"
                            color="primary"
                            variant="outlined"
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
              </>
            )}

            {activeTab === 1 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">My Content</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/content')}
                  >
                    View All
                  </Button>
                </Box>
                <List>
                  {myContent.length > 0 ? (
                    myContent.map((content) => (
                      <React.Fragment key={content._id}>
                        <ListItem
                          secondaryAction={
                            <IconButton onClick={() => handleViewContent(content._id)}>
                              <MoreVertIcon />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                              {getContentIcon(content.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={content.title}
                            secondary={`${getContentTypeLabel(content.type)} • Created: ${new Date(content.createdAt).toLocaleDateString()}`}
                          />
                          <Chip
                            label={`${content.allowedStudents?.length || 0} students`}
                            size="small"
                            color="secondary"
                            variant="outlined"
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
              </>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleCreateQuiz}
                sx={{ justifyContent: 'flex-start' }}
              >
                Create New Quiz
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<VideoLibraryIcon />}
                onClick={handleCreateContent}
                sx={{ justifyContent: 'flex-start' }}
              >
                Create Content
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AnalyticsIcon />}
                onClick={handleViewAnalytics}
                sx={{ justifyContent: 'flex-start' }}
              >
                View Analytics
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/manage-assignments')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Manage Assignments
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/students')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Manage Students
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/profile')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Connection Requests Section */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <ConnectionRequests />
        </Paper>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="create quiz"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateQuiz}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default InstructorDashboardPage;
