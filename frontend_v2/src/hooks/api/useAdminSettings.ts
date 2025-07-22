// src/hooks/api/useAdminSettings.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { AllSettingsResponse, GlobalSettings } from '@/types/admin';

export function useAdminSettings() {
  const queryClient = useQueryClient();

  // Query to fetch all settings data
  const settingsQuery = useQuery<AllSettingsResponse, Error>({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await api.get('/admin/settings');
      return response.data;
    },
  });

  // Mutation to update the global settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: GlobalSettings) => {
      // The backend expects the payload to be wrapped in a 'global_settings' key
      const response = await api.put('/admin/settings', { global_settings: settings });
      return response.data;
    },
    onSuccess: () => {
      // When the mutation is successful, invalidate the query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });

  return {
    settingsQuery,
    updateSettingsMutation,
  };
}