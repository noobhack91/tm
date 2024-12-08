// src/components/PrivateRoute.tsx  
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {    
  children: React.ReactNode;    
  adminOnly?: boolean;    
}    

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, adminOnly = false }) => {    
  const { isAuthenticated, user } = useAuth();    

  if (!isAuthenticated) {    
    return <Navigate to="/login" replace />;    
  }    

  // Check if the user has the required role    
  const hasAccess = adminOnly    
    ? user?.roles?.includes('super_admin') // Safely check roles    
    : true;    

  if (!hasAccess) {    
    return <Navigate to="/unauthorized" replace />;    
  }    

  return <>{children}</>;    
};    