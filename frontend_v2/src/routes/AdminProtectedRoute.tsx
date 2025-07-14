// src/routes/AdminProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import LoadingSpinner from '@/components/ui/loading-spinner';

export const AdminProtectedRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  // The isLoading check from the top-level App component handles the initial load.
  // This check is a safeguard for any subsequent loading states if they were to occur.
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // First, check if the user is authenticated at all.
  // If not, they should definitely go to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Next, check if the authenticated user has the permission to access the admin dashboard.
  const canAccessAdmin = user?.permissions.includes('access_admin_dashboard');

  // THE FIX IS HERE:
  // If the user is authenticated but lacks the specific permission,
  // redirect them to their default dashboard page, NOT the login page.
  if (!canAccessAdmin) {
    return <Navigate to="/chat" replace />;
  }

  // If all checks pass (user is authenticated AND has permission),
  // render the AdminLayout with the nested admin route content.
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};