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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Audiotrack as AudiotrackIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import InstructorBrowser from '../components/common/InstructorBrowser';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StudentDashboardPage = () => {
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [receivedContent, setReceivedContent] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTime: 0,
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserQuizzes, getQuizStats, getAvailableQuizzes } = useQuiz();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const fetchReceivedContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/content/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching received content:', error);
      return [];
    }
  };

  const loadDashboardData = async () => {
    try {
      const [quizzes, statsData, available, content] = await Promise.all([
        getUserQuizzes(),
        getQuizStats(),
        getAvailableQuizzes(),
        fetchReceivedContent(),
      ]);
      setRecentQuizzes(quizzes.slice(0, 5));
      setStats(statsData);
      setAvailableQuizzes(available.slice(0, 5));
      setReceivedContent(content.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleTakeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleBrowseQuizzes = () => {
    navigate('/quizzes');
  };

  const handleViewContent = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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
          Welcome back, {user?.profile?.firstName || user?.username || 'Student'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to learn? Take a quiz or review your progress.
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
                  Total Quizzes
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
                <TrendingUpIcon color="success" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Completed
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {stats.completedQuizzes}
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
                <PlayArrowIcon color="secondary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Study Time
                </Typography>
              </Box>
              <Typography variant="h3" color="secondary.main">
                {formatTime(stats.totalTime)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Quizzes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Available Quizzes</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleBrowseQuizzes}
              >
                Browse All
              </Button>
            </Box>
            <List>
              {availableQuizzes.length > 0 ? (
                availableQuizzes.map((quiz) => (
                  <React.Fragment key={quiz._id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => handleTakeQuiz(quiz._id)}
                        >
                          Take Quiz
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {quiz.title.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={quiz.title}
                        secondary={`${quiz.questions?.length || 0} questions • ${quiz.timeLimit || 'No limit'}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No quizzes available at the moment
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Activity</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </Button>
            </Box>
            <List>
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <React.Fragment key={quiz._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          {quiz.title.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={quiz.title}
                        secondary={`Score: ${quiz.score || 'Not completed'} • ${new Date(quiz.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent quiz activity
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Received Content */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Received Content</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/content')}
              >
                View All
              </Button>
            </Box>
            <List>
              {receivedContent.length > 0 ? (
                receivedContent.map((content) => (
                  <React.Fragment key={content._id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={getContentIcon(content.type)}
                          onClick={() => handleViewContent(content._id)}
                        >
                          View
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {getContentIcon(content.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={content.title}
                        secondary={`${getContentTypeLabel(content.type)} • From ${content.instructor?.profile?.firstName || content.instructor?.username} • ${new Date(content.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No content received from instructors yet
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Instructor Browser Section */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PeopleIcon sx={{ mr: 1 }} />
            <Typography variant="h5">
              Connect with Instructors
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Browse available instructors and send connection requests to access their quizzes and content.
          </Typography>
          <InstructorBrowser />
        </Paper>
      </Box>
    </Container>
  );
};

export default StudentDashboardPage;
