import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

const Timer = ({ timeRemaining }) => {
  const [timeLeft, setTimeLeft] = useState(timeRemaining);

  useEffect(() => {
    setTimeLeft(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 60) return 'error';
    if (timeLeft <= 300) return 'warning';
    return 'default';
  };

  return (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <AccessTime fontSize="small" />
      <Typography variant="body2" color="text.secondary">
        Time Remaining:
      </Typography>
      <Chip
        label={formatTime(timeLeft)}
        color={getTimeColor()}
        size="small"
        variant="outlined"
      />
    </Box>
  );
};

export default Timer;
