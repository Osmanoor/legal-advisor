// src/hooks/api/useAdminFeedback.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export type ReviewFilterType = 'pending' | 'approved' | 'archived' | 'all';

// Type matching the backend response for a single review
export interface Feedback {
  id: number;
  user_id: string | null;
  user_name: string;
  user_profile_picture_url: string | null; // <-- ADD THIS FIELD
  rating: number;
  comment: string;
  is_approved: boolean;
  is_archived: boolean;
  submitted_at: string;
  preview_settings: { // Make the shape explicit for clarity
      show_name: boolean;
      show_workplace: boolean;
      show_job_title: boolean;
      show_profile_picture: boolean;
  };
}

// The shape of the data the backend expects for an update
export interface FeedbackUpdatePayload {
  is_approved?: boolean;
  is_archived?: boolean;
  comment?: string;
  // Add other editable fields here if needed in the future
}

// The paginated response from the backend
interface PaginatedFeedbackResponse {
  reviews: Feedback[];
  total: number;
  pages: number;
  current_page: number;
}

export function useAdminFeedback(page: number = 1, perPage: number = 20, filter: ReviewFilterType = 'pending') {
  const queryClient = useQueryClient();

  const feedbackQuery = useQuery<PaginatedFeedbackResponse, Error>({
    // The filter is now part of the query key, so React Query will refetch when it changes
    queryKey: ['admin', 'feedback', { page, perPage, filter }],
    queryFn: async () => {
      const response = await api.get('/admin/reviews', {
        params: {
          page: page,
          per_page: perPage,
          filter: filter, // Pass the filter to the backend
        },
      });
      return response.data;
    },
  });

  // --- IMPLEMENT THE UPDATE MUTATION ---
  const updateFeedbackMutation = useMutation({
    mutationFn: async (variables: { reviewId: number; payload: FeedbackUpdatePayload }): Promise<Feedback> => {
      const { reviewId, payload } = variables;
      const response = await api.put(`/admin/reviews/${reviewId}`, payload);
      return response.data;
    },
    // When a review is updated, invalidate the query to refetch the list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback'] });
    },
  });

  // Delete mutation can be added here in the future if needed
  // ...

  return {
    feedbackQuery,
    updateFeedbackMutation,
  };
}