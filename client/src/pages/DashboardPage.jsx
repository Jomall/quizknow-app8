import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    // This component will immediately redirect based on role
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'student':
      return <Navigate to="/student-dashboard" replace />;
    case 'instructor':
      return <Navigate to="/instructor-dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin-dashboard" replace />;
    default:
      // Fallback to student dashboard if role is unknown
      return <Navigate to="/student-dashboard" replace />;
  }
};

export default DashboardPage;
