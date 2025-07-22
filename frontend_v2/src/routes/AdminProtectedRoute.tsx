// src/routes/AdminProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Permission } from '@/types/user';

// List of permissions that grant access to at least one admin page.
const ADMIN_PAGE_PERMISSIONS: Permission[] = [
  'view_analytics',
  'manage_users',
  'manage_feedback',
  'manage_contacts',
  'manage_global_settings',
];

export const AdminProtectedRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // User must be authenticated to even consider admin access.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // --- NEW LOGIC ---
  // Check if the user has at least one permission from our list.
  const canAccessAdminArea = user?.permissions.some(p => ADMIN_PAGE_PERMISSIONS.includes(p));

  // If they have at least one permission, render the layout.
  // The individual page links in the sidebar will be controlled by their specific permissions.
  if (canAccessAdminArea) {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  // If authenticated but has no admin page permissions, redirect to the main user dashboard.
  return <Navigate to="/chat" replace />;
};