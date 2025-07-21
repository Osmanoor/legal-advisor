// src/hooks/api/useFeedback.ts

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// The data structure for the submission payload
interface FeedbackPayload {
  rating: number;
  comment?: string;
  preview_settings: {
    show_name: boolean;
    show_workplace: boolean;
    show_job_title: boolean;
    show_profile_picture: boolean;
  };
}

// The expected response from the API on success
interface FeedbackResponse {
  message: string;
}

export function useFeedback() {
  
  const submitFeedbackMutation = useMutation<FeedbackResponse, Error, FeedbackPayload>({
    mutationFn: (payload) => api.post('/reviews', payload),
  });

  return {
    submitFeedbackMutation,
  };
}