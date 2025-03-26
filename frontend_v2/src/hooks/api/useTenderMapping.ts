// src/hooks/api/useTenderMapping.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { TenderCategory, TenderMappingResult, MappingRule } from '@/types/tenderMapping';

// Get all tender categories for dropdowns
export function useTenderCategories() {
  return useQuery({
    queryKey: ['tender-mapping', 'categories'],
    queryFn: async () => {
      const response = await api.get('/tender-mapping/categories');
      return response.data as TenderCategory[];
    }
  });
}

// Map inputs to tender type
export function useTenderMap() {
  return useMutation({
    mutationFn: async (inputs: Record<string, string>) => {
      const response = await api.post('/tender-mapping/map', inputs);
      return response.data as TenderMappingResult;
    }
  });
}

// Save a new mapping rule
export function useSaveMappingRule() {
  return useMutation({
    mutationFn: async (rule: MappingRule) => {
      const response = await api.post('/tender-mapping/rules', rule);
      return response.data;
    }
  });
}