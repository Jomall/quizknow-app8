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
  Tab,
  Tabs,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  AdminPanelSettings as AdminIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalAdmins: 0,
    totalQuizzes: 0,
    pendingApprovals: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - in real app, fetch from API
      setStats({
        totalUsers: 1250,
        totalStudents: 1100,
        totalInstructors: 120,
        totalAdmins: 30,
        totalQuizzes: 450,
        pendingApprovals: 5,
      });
      setRecentUsers([
        { id: 1, name: 'John Doe', role: 'student', email: 'john@example.com', joined: '2024-01-15' },
        { id: 2, name: 'Jane Smith', role: 'instructor', email: 'jane@example.com', joined: '2024-01-14' },
        { id: 3, name: 'Bob Johnson', role: 'student', email: 'bob@example.com', joined: '2024-01-13' },
      ]);
      setPendingInstructors([
        { id: 1, name: 'Alice Wilson', email: 'alice@example.com', applied: '2024-01-10' },
        { id: 2, name: 'Charlie Brown', email: 'charlie@example.com', applied: '2024-01-09' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleApproveInstructor = (instructorId) => {
    // Handle instructor approval
    console.log('Approving instructor:', instructorId);
  };

  const handleViewReports = () => {
    navigate('/admin/reports');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.profile?.firstName || user?.username || 'Admin'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          System administration and user management dashboard.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1, fontSize: '0.9rem' }}>
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="success" />
                <Typography variant="h6" sx={{ ml: 1, fontSize: '0.9rem' }}>
                  Students
                </Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="info" />
                <Typography variant="h6" sx={{ ml: 1, fontSize: '0.9rem' }}>
                  Instructors
                </Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {stats.totalInstructors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AdminIcon color="secondary" />
                <Typography variant="h6" sx={{ ml: 1, fontSize: '0.9rem' }}>
                  Admins
                </Typography>
              </Box>
              <Typography variant="h4" color="secondary.main">
                {stats.totalAdmins}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="warning" />
                <Typography variant="h6" sx={{ ml: 1, fontSize: '0.9rem' }}>
                  Quizzes
                </Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {stats.totalQuizzes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonAddIcon color="error" />
                <Typography variant="h6" sx={{ ml: 1, fontSize: '0.9rem' }}>
                  Pending
                </Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                {stats.pendingApprovals}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
                <Tab label="Recent Users" />
                <Tab label="Pending Approvals" />
                <Tab label="System Overview" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Recent User Registrations</Typography>
                  <Button variant="outlined" size="small" onClick={handleManageUsers}>
                    Manage All Users
                  </Button>
                </Box>
                <List>
                  {recentUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <ListItem
                        secondaryAction={
                          <Chip
                            label={user.role}
                            size="small"
                            color={user.role === 'student' ? 'primary' : user.role === 'instructor' ? 'info' : 'secondary'}
                          />
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.name}
                          secondary={`${user.email} • Joined: ${user.joined}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {tabValue === 1 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Pending Instructor Approvals
                </Typography>
                <List>
                  {pendingInstructors.map((instructor) => (
                    <React.Fragment key={instructor.id}>
                      <ListItem
                        secondaryAction={
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleApproveInstructor(instructor.id)}
                          >
                            Approve
                          </Button>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'info.main' }}>
                            {instructor.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={instructor.name}
                          secondary={`${instructor.email} • Applied: ${instructor.applied}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {tabValue === 2 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  System Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<TrendingUpIcon />}
                      onClick={handleViewReports}
                      sx={{ justifyContent: 'flex-start', p: 2 }}
                    >
                      View System Reports
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      onClick={handleManageUsers}
                      sx={{ justifyContent: 'flex-start', p: 2 }}
                    >
                      User Management
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardPage;
