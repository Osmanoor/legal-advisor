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

export function useAdminContacts() {
  const queryClient = useQueryClient();

  const contactsQuery = useQuery<ContactSubmission[], Error>({
    queryKey: ['admin', 'contacts'],
    queryFn: async () => {
      const response = await api.get('/admin/contact-submissions');
      return response.data;
    },
  });

  // --- IMPLEMENT THE UPDATE MUTATION ---
  const updateContactStatusMutation = useMutation({
    mutationFn: async (variables: { id: number; status: 'new' | 'read' | 'archived' }): Promise<ContactSubmission> => {
      const { id, status } = variables;
      const response = await api.put(`/admin/contact-submissions/${id}/status`, { status });
      return response.data;
    },
    // When a contact status is updated, invalidate the query to refetch the list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
  });

  return {
    contactsQuery,
    updateContactStatusMutation,
  };
}