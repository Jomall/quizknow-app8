import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Audiotrack as AudiotrackIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const ContentViewPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { contentId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/content/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Content not found or access denied');
    } finally {
      setLoading(false);
    }
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

  const handleDownload = () => {
    if (content.filePath) {
      window.open(`${API_BASE_URL.replace('/api', '')}/uploads/${content.fileName}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading content...</Typography>
      </Container>
    );
  }

  if (error || !content) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">{error || 'Content not found'}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {getContentIcon(content.type)}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {content.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              From {content.instructor?.profile?.firstName || content.instructor?.username}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {content.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {content.description}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            label={content.type.charAt(0).toUpperCase() + content.type.slice(1)}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Created ${new Date(content.createdAt).toLocaleDateString()}`}
            variant="outlined"
          />
        </Box>

        {content.type === 'link' && content.url && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Link
            </Typography>
            <Button
              variant="contained"
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Link
            </Button>
          </Box>
        )}

        {content.filePath && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              File
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download {content.fileName}
            </Button>
            {content.fileSize && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Size: {(content.fileSize / 1024 / 1024).toFixed(2)} MB
              </Typography>
            )}
          </Box>
        )}

        {content.tags && content.tags.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {content.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ContentViewPage;
