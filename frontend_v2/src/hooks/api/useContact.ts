// src/hooks/api/useContact.ts

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// The data structure for the submission payload
interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

// The expected response from the API on success
interface ContactResponse {
  message: string;
}

export function useContact() {
  
  const submitContactMutation = useMutation<ContactResponse, Error, ContactPayload>({
    mutationFn: (payload) => api.post('/contact', payload),
  });

  return {
    submitContactMutation,
  };
}