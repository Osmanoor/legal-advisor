// src/hooks/api/useAdminRolesAndPermissions.ts

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

interface RolesAndPermissionsResponse {
  roles: Role[];
  permissions: Permission[];
}

export function useAdminRolesAndPermissions() {
  return useQuery<RolesAndPermissionsResponse, Error>({
    queryKey: ['admin', 'rolesAndPermissions'],
    queryFn: async () => {
      const response = await api.get('/admin/roles-and-permissions');
      return response.data;
    },
    // This data rarely changes, so we can cache it for a long time.
    staleTime: Infinity,
  });
}