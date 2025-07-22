// src/hooks/api/useAdminRolesAndPermissions.ts

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
// --- FIX: Import the correct response type ---
import { RolesAndPermissionsResponse } from '@/types/admin'; 

export function useAdminRolesAndPermissions() {
  return useQuery<RolesAndPermissionsResponse, Error>({
    queryKey: ['admin', 'rolesAndPermissions'],
    queryFn: async () => {
      // --- FIX: The endpoint name was wrong, it's part of the settings fetch ---
      // This hook is actually redundant if we always fetch settings,
      // but let's keep it for now for separation of concerns. It just needs
      // to hit the right endpoint.
      const response = await api.get('/admin/settings');
      return {
          roles: response.data.roles,
          all_permissions: response.data.all_permissions
      };
    },
    staleTime: Infinity,
  });
}