// src/hooks/api/useAdminUsers.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { User } from '@/types/user';

// The payload now includes permission_overrides
export interface UserUpdatePayload {
  fullName?: string;
  email?: string;
  jobTitle?: string;
  role_ids?: number[];
  permission_overrides?: {
      permission_id: number;
      override_type: 'ALLOW' | 'DENY';
  }[];
}

interface PaginatedUsersResponse {
  users: User[];
  total: number;
  pages: number;
  current_page: number;
}

export function useAdminUsers(page: number = 1, perPage: number = 10) {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<PaginatedUsersResponse, Error>({
    queryKey: ['admin', 'users', { page, perPage }],
    queryFn: async () => {
      const response = await api.get('/admin/users', {
        params: { page, per_page: perPage },
      });
      return response.data;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (variables: { userId: string; payload: UserUpdatePayload }): Promise<User> => {
      const { userId, payload } = variables;
      const response = await api.put(`/admin/users/${userId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  // --- NEW DELETE MUTATION ---
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string): Promise<{ message: string }> => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  return {
    usersQuery,
    updateUserMutation,
    deleteUserMutation, // Expose the new mutation
  };
}