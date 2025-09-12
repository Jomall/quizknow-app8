import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StudentSelector = ({ selectedStudents, onSelectionChange, multiple = true }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConnectedStudents();
  }, []);

  const fetchConnectedStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/connections/my-connections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter to get only accepted connections where the other party is a student
      const studentConnections = response.data.filter(conn =>
        conn.status === 'accepted' && (
          (conn.sender.role === 'student' && conn.receiver.role !== 'student') ||
          (conn.receiver.role === 'student' && conn.sender.role !== 'student')
        )
      );
      setConnections(studentConnections);
    } catch (err) {
      setError('Failed to load connected students');
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId) => {
    if (multiple) {
      const newSelection = selectedStudents.includes(studentId)
        ? selectedStudents.filter(id => id !== studentId)
        : [...selectedStudents, studentId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([studentId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === connections.length) {
      onSelectionChange([]);
    } else {
      const allStudentIds = connections.map(conn => {
        const student = conn.sender.role === 'student' ? conn.sender : conn.receiver;
        return student._id;
      });
      onSelectionChange(allStudentIds);
    }
  };

  const getStudentInfo = (connection) => {
    return connection.sender.role === 'student' ? connection.sender : connection.receiver;
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
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <PeopleIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Select Students ({selectedStudents.length} selected)
        </Typography>
      </Box>

      {connections.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No connected students found. Connect with students first to assign content.
        </Typography>
      ) : (
        <>
          {multiple && (
            <Box mb={2}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectAll}
              >
                {selectedStudents.length === connections.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>
          )}

          <FormGroup>
            {connections.map((connection) => {
              const student = getStudentInfo(connection);
              const isSelected = selectedStudents.includes(student._id);

              return (
                <FormControlLabel
                  key={student._id}
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleStudentToggle(student._id)}
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={student.profile?.avatar}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      >
                        {student.profile?.firstName?.[0] || student.username?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {student.profile?.firstName} {student.profile?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{student.username}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              );
            })}
          </FormGroup>

          {selectedStudents.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Selected Students:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedStudents.map((studentId) => {
                  const connection = connections.find(conn => {
                    const student = getStudentInfo(conn);
                    return student._id === studentId;
                  });
                  if (!connection) return null;
                  const student = getStudentInfo(connection);

                  return (
                    <Chip
                      key={student._id}
                      label={`${student.profile?.firstName || student.username}`}
                      size="small"
                      onDelete={() => handleStudentToggle(student._id)}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default StudentSelector;
