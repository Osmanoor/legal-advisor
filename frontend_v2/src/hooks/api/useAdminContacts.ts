// src/hooks/api/useAdminContacts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  submitted_at: string; // ISO string
}

// New interface for the paginated response
export interface PaginatedContactsResponse {
  submissions: ContactSubmission[];
  total: number;
  pages: number;
  current_page: number;
}

// The hook now accepts pagination parameters
export function useAdminContacts(page: number = 1, perPage: number = 10) {
  const queryClient = useQueryClient();

  // The query now uses the paginated response type and includes page in its key
  const contactsQuery = useQuery<PaginatedContactsResponse, Error>({
    queryKey: ['admin', 'contacts', { page, perPage }],
    queryFn: async () => {
      const response = await api.get('/admin/contact-submissions', {
        params: {
          page: page,
          per_page: perPage,
        },
      });
      return response.data;
    },
  });

  const updateContactStatusMutation = useMutation({
    mutationFn: async (variables: { id: number; status: 'new' | 'read' | 'archived' }): Promise<ContactSubmission> => {
      const { id, status } = variables;
      const response = await api.put(`/admin/contact-submissions/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all contacts queries to refetch the potentially changed list
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
  });

  return {
    contactsQuery,
    updateContactStatusMutation,
  };
}