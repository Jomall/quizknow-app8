import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header user={user} onLogout={logout} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
