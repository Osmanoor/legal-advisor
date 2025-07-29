// src/hooks/api/useAdminContacts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export type ContactStatusFilter = 'new' | 'read' | 'archived' | 'all';

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  submitted_at: string; // ISO string
}

export interface PaginatedContactsResponse {
  submissions: ContactSubmission[];
  total: number;
  pages: number;
  current_page: number;
}

export function useAdminContacts(page: number = 1, perPage: number = 10, filter: ContactStatusFilter = 'new') {
  const queryClient = useQueryClient();

  const contactsQuery = useQuery<PaginatedContactsResponse, Error>({
    queryKey: ['admin', 'contacts', { page, perPage, filter }],
    queryFn: async () => {
      const response = await api.get('/admin/contact-submissions', {
        params: {
          page: page,
          per_page: perPage,
          filter: filter, // Pass filter to the API
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
  });

  return {
    contactsQuery,
    updateContactStatusMutation,
  };
}