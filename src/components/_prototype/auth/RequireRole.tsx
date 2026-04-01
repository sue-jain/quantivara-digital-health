import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireRoleProps {
  role: 'patient' | 'doctor';
  children: React.ReactElement;
}

const RequireRole: React.FC<RequireRoleProps> = ({ role, children }) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userType !== role) {
    // Redirect to the correct dashboard based on actual role
    return <Navigate to={userType === 'doctor' ? '/doctor/dashboard' : '/user'} replace />;
  }

  return children;
};

export default RequireRole;


