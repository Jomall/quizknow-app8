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
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';

const DashboardPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTime: 0,
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserQuizzes, getQuizStats } = useQuiz();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [quizzes, statsData] = await Promise.all([
        getUserQuizzes(),
        getQuizStats(),
      ]);
      setRecentQuizzes(quizzes.slice(0, 5));
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };

  const handleTakeQuiz = () => {
    navigate('/browse-quizzes');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your quizzes today.
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
                <PeopleIcon color="secondary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Total Time
                </Typography>
              </Box>
              <Typography variant="h3" color="secondary.main">
                {formatTime(stats.totalTime)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Activity</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/history')}
              >
                View All
              </Button>
            </Box>
            <List>
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <React.Fragment key={quiz._id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" onClick={handleMenuOpen}>
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
                variant="outlined"
                fullWidth
                onClick={handleTakeQuiz}
                sx={{ justifyContent: 'flex-start' }}
              >
                Browse Quizzes
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Retake Quiz</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
      </Menu>
    </Container>
  );
};

export default DashboardPage;
