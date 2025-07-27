// File: src/hooks/api/useAdminUsers.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { UserSummary, AdminDetailedUser, UserUpdatePayload, UserCreatePayload } from '@/types/user';

interface PaginatedUsersResponse {
  users: UserSummary[];
  total: number;
  pages: number;
  current_page: number;
}

// HOOK for fetching user list, creating, updating, and deleting
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

  const createUserMutation = useMutation({
    mutationFn: async (payload: UserCreatePayload): Promise<AdminDetailedUser> => {
      const response = await api.post('/admin/users', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (variables: { userId: string; payload: UserUpdatePayload }): Promise<AdminDetailedUser> => {
      const { userId, payload } = variables;
      const response = await api.put(`/admin/users/${userId}`, payload);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.setQueryData(['admin', 'users', updatedUser.id], updatedUser);
    },
  });

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
    createUserMutation, // <-- EXPORTED
    updateUserMutation,
    deleteUserMutation,
  };
}

// HOOK to fetch a single user's details for the edit dialog
export function useAdminUser(userId: string | null) {
  return useQuery<AdminDetailedUser, Error>({
    queryKey: ['admin', 'users', userId],
    queryFn: async () => {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}