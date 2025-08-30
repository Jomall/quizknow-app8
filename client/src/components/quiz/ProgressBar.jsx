import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const ProgressBar = ({ progress }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: progress === 100 ? '#4caf50' : '#1976d2',
              },
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressBar;
