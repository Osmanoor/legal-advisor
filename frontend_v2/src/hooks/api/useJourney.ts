// src/hooks/api/useJourney.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { JourneyLevel, JourneyResource } from '@/types/journey';

// Get all levels
export function useJourneyLevels() {
  return useQuery({
    queryKey: ['journey', 'levels'],
    queryFn: async () => {
      const response = await api.get('/journey/levels');
      return response.data as JourneyLevel[];
    }
  });
}

// Get level resources
export function useJourneyLevelResources(levelId: string) {
  return useQuery({
    queryKey: ['journey', 'level', levelId],
    queryFn: async () => {
      const response = await api.get(`/journey/levels/${levelId}`);
      return response.data as JourneyLevel;
    },
    enabled: !!levelId,
  });
}

// View resource
export function useResourceView() {
  return useMutation({
    mutationFn: async ({ levelId, resourceId }: { levelId: string, resourceId: string }) => {
      const response = await api.get(`/journey/levels/${levelId}/resources/${resourceId}/view`);
      return response.data;
    },
  });
}

// Download resource
export function useResourceDownload() {
  return useMutation({
    mutationFn: async ({ levelId, resourceId }: { levelId: string, resourceId: string }) => {
      const response = await api.get(
        `/journey/levels/${levelId}/resources/${resourceId}/download`,
        { responseType: 'blob' }
      );
      return { blob: response.data, filename: resourceId };
    },
  });
}

// Helper for downloading
export function downloadResource(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper for opening in new tab
export function openResourceInNewTab(blob: Blob, mimeType: string) {
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.onload = () => URL.revokeObjectURL(url);
  }
}