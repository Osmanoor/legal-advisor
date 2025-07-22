// src/routes/PermissionProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePermission } from '@/hooks/usePermission';
import { useAuthStore } from '@/stores/authStore';
import { Permission } from '@/types/user';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PermissionProtectedRouteProps {
  permission: Permission;
}

export const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({ permission }) => {
  const { canAccess, isLoading: isPermissionLoading } = usePermission();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  const isLoading = isPermissionLoading || isAuthLoading;

  // Show a loading spinner while guest settings or auth status are being fetched
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Tier 1: Check if the user (or guest) has permission to access the feature.
  if (canAccess(permission)) {
    return <Outlet />;
  }

  // Tier 2: If access is denied, decide where to redirect.
  // If the user is logged in but lacks permission, send them to their default page.
  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }
  
  // If the user is not logged in (a guest) and lacks permission, send to login.
  return <Navigate to="/login" replace />;
};