
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  isPublicRoute?: boolean;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  redirectTo = '/',
  isPublicRoute = false,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // If we're still loading the auth state, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // For the auth section, redirect to admin if user is logged in
  if (currentPath === '/auth' && user) {
    return <Navigate to="/admin" replace />;
  }

  // Allow public routes to be accessed regardless of auth status
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, if the user is not authenticated, redirect to login
  if (!user) {
    console.log('User not authenticated, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated, allow access to all routes
  return <>{children}</>;
};

export default RoleGuard;
