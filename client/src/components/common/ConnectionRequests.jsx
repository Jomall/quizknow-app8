import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const ConnectionRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    request: null,
  });

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/connections/pending-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error loading pending requests:', error);
      setError('Failed to load connection requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (request) => {
    setConfirmDialog({
      open: true,
      action: 'accept',
      request,
    });
  };

  const handleRejectRequest = (request) => {
    setConfirmDialog({
      open: true,
      action: 'reject',
      request,
    });
  };

  const handleConfirmAction = async () => {
    try {
      setProcessing(confirmDialog.request._id);
      const token = localStorage.getItem('token');
      const endpoint = confirmDialog.action === 'accept' ? 'accept' : 'reject';

      await axios.put(`${API_BASE_URL}/connections/${endpoint}/${confirmDialog.request._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the request from the list
      setPendingRequests(prev =>
        prev.filter(req => req._id !== confirmDialog.request._id)
      );

      setConfirmDialog({ open: false, action: null, request: null });
    } catch (error) {
      console.error('Error processing request:', error);
      setError(`Failed to ${confirmDialog.action} request`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
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
        Connection Requests
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage student requests to connect with you.
      </Typography>

      {pendingRequests.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Pending Requests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                When students send you connection requests, they'll appear here.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <List>
          {pendingRequests.map((request) => (
            <Card key={request._id} sx={{ mb: 2 }}>
              <CardContent>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${request.sender.profile?.firstName || ''} ${request.sender.profile?.lastName || ''}`.trim() || request.sender.username}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          @{request.sender.username}
                        </Typography>
                        {request.sender.profile?.institution && (
                          <Typography variant="body2" color="text.secondary">
                            📚 {request.sender.profile.institution}
                          </Typography>
                        )}
                        {request.message && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            "{request.message}"
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleAcceptRequest(request)}
                        disabled={processing === request._id}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleRejectRequest(request)}
                        disabled={processing === request._id}
                      >
                        Reject
                      </Button>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, request: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirmDialog.action === 'accept' ? 'Accept Connection Request' : 'Reject Connection Request'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action} the connection request from{' '}
            <strong>
              {confirmDialog.request?.sender?.profile?.firstName || confirmDialog.request?.sender?.username}
            </strong>?
          </Typography>
          {confirmDialog.action === 'accept' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Once accepted, this student will be able to receive quizzes and content from you.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, action: null, request: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={confirmDialog.action === 'accept' ? 'success' : 'error'}
            disabled={processing !== null}
          >
            {confirmDialog.action === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConnectionRequests;
