import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const InstructorBrowser = () => {
  const [instructors, setInstructors] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestDialog, setRequestDialog] = useState({
    open: false,
    instructor: null,
    message: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [instructorsRes, connectionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users/instructors`),
        axios.get(`${API_BASE_URL}/connections/my-connections`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setInstructors(instructorsRes.data);
      setConnections(connectionsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const getConnectionStatus = (instructorId) => {
    const connection = connections.find(conn => {
      const otherUser = conn.sender._id === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id
        ? conn.receiver._id
        : conn.sender._id;
      return otherUser === instructorId;
    });

    if (!connection) return null;
    return connection.status;
  };

  const handleSendRequest = (instructor) => {
    setRequestDialog({
      open: true,
      instructor,
      message: `Hi ${instructor.profile?.firstName || instructor.username}, I'd like to connect with you to access your quizzes and content.`,
    });
  };

  const handleConfirmRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/connections/request`, {
        receiverId: requestDialog.instructor._id,
        message: requestDialog.message,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequestDialog({ open: false, instructor: null, message: '' });
      loadData(); // Refresh data to show pending status
    } catch (error) {
      console.error('Error sending request:', error);
      setError('Failed to send connection request');
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'accepted':
        return <Chip icon={<CheckCircleIcon />} label="Connected" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<HourglassEmptyIcon />} label="Pending" color="warning" size="small" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Browse Instructors
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Connect with instructors to access their quizzes and content.
      </Typography>

      <Grid container spacing={3}>
        {instructors.map((instructor) => {
          const connectionStatus = getConnectionStatus(instructor._id);

          return (
            <Grid item xs={12} sm={6} md={4} key={instructor._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {instructor.profile?.firstName || ''} {instructor.profile?.lastName || ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{instructor.username}
                      </Typography>
                    </Box>
                  </Box>

                  {instructor.profile?.bio && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {instructor.profile.bio}
                    </Typography>
                  )}

                  {instructor.profile?.institution && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      📚 {instructor.profile.institution}
                    </Typography>
                  )}

                  {connectionStatus && (
                    <Box sx={{ mt: 2 }}>
                      {getStatusChip(connectionStatus)}
                    </Box>
                  )}
                </CardContent>

                <CardActions>
                  {connectionStatus === 'accepted' ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled
                    >
                      Already Connected
                    </Button>
                  ) : connectionStatus === 'pending' ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled
                    >
                      Request Sent
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={() => handleSendRequest(instructor)}
                    >
                      Send Request
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Connection Request Dialog */}
      <Dialog
        open={requestDialog.open}
        onClose={() => setRequestDialog({ open: false, instructor: null, message: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Connection Request
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Send a connection request to {requestDialog.instructor?.profile?.firstName || requestDialog.instructor?.username}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Message (Optional)"
            value={requestDialog.message}
            onChange={(e) => setRequestDialog(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Introduce yourself and explain why you'd like to connect..."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRequestDialog({ open: false, instructor: null, message: '' })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRequest}
            variant="contained"
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorBrowser;
