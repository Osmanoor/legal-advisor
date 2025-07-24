// Updated src/hooks/api/useTenderMapping.ts

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { TenderCalculationResult, WorkType } from '@/types/tenderMapping';
import { trackEvent } from '@/lib/analytics';

// Get all work types for dropdown
export function useTenderWorkTypes() {
  return useQuery({
    queryKey: ['tender-mapping', 'work-types'],
    queryFn: async () => {
      const response = await api.get('/tender-mapping/work-types');
      return response.data as WorkType[];
    }
  });
}

// Calculate procurement details
export function useCalculateProcurement() {
  return useMutation({
    mutationFn: async (data: {
      work_type: string;
      budget: number;
      start_date: string;
      project_duration: number;
      holidays?: string[];
    }) => {
      const response = await api.post('/tender-mapping/calculate', data);
      return response.data as TenderCalculationResult;
    },
    onSuccess: () => {
      trackEvent({ event: 'feature_used', feature_name: 'report_generator' });
    }
  });
}

// Optional: Save a mapping rule if you still need this functionality
export function useSaveMappingRule() {
  return useMutation({
    mutationFn: async (rule: any) => {
      const response = await api.post('/tender-mapping/rules', rule);
      return response.data;
    }
  });
}