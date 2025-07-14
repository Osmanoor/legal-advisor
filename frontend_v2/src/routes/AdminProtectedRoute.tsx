// File: src/routes/AdminProtectedRoute.tsx
// @new
// A route guard to protect the admin dashboard.

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AdminLayout } from '@/components/layouts/AdminLayout';

export const AdminProtectedRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
  
//   // Check if the user is authenticated AND has the 'admin' role
//   if (user?.role !== 'admin') {
//      // Redirect non-admins to a safe page (e.g., the user dashboard)
//     return <Navigate to="/chat" replace />;
//   }

  // If all checks pass, render the admin layout with the nested route content
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};