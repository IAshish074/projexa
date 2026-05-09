import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A wrapper for protected routes that redirects to login if the user is not authenticated
 * or to a "not authorized" page if the user doesn't have the required role.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role is authorized
  if (roles && !roles.includes(user.role)) {
    // If not authorized, redirect to dashboard or a specific "unauthorized" page
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
