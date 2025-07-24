// src/hooks/api/useCorrection.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { CorrectionRequest, CorrectionResponse } from '@/types/correction';
import { trackEvent } from '@/lib/analytics';

export function useCorrection() {
  return useMutation<CorrectionResponse, Error, CorrectionRequest>({
    mutationFn: async ({ text, language }) => {
      const response = await api.post('/correction', {
        text,
        language,
      });
      return response.data;
    },
    onSuccess: () => {
      trackEvent({ event: 'feature_used', feature_name: 'text_corrector' });
    }
  });
}