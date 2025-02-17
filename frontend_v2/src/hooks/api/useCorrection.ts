// src/hooks/api/useCorrection.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { CorrectionRequest, CorrectionResponse } from '@/types/correction';

export function useCorrection() {
  return useMutation<CorrectionResponse, Error, CorrectionRequest>({
    mutationFn: async ({ text, language }) => {
      const response = await api.post('/correction', {
        text,
        language,
      });
      return response.data;
    },
  });
}