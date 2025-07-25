// src/hooks/api/useCorrection.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { CorrectionRequest, CorrectionResponse } from '@/types/correction';
import { trackEvent } from '@/lib/analytics';

export function useCorrection() {
  return useMutation<CorrectionResponse, Error, CorrectionRequest>({
    mutationFn: async ({ text, language, mode }) => { // <-- Add mode here
      const response = await api.post('/correction', {
        text,
        language,
        mode, // <-- Pass mode in the request body
      });
      return response.data;
    },
    onSuccess: (_data, variables) => { // Access variables to track different events
      // Track different events for correction vs. enhancement
      const featureName = variables.mode === 'enhance' ? 'text_enhancer' : 'text_corrector';
      trackEvent({ event: 'feature_used', feature_name: featureName });
    }
  });
}