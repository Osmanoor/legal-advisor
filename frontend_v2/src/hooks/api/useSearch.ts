// src/hooks/api/useSearch.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ResourceType, SearchResource } from '@/types';

export function useSearch(query: string, type?: ResourceType) {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      const response = await api.get('/search', {
        params: {
          query: query.trim(),
          type: type !== 'Both' ? type : undefined
        }
      });
      return response.data;
    },
    enabled: false,
  });
}