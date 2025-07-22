// src/hooks/api/useGuestSettings.ts

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface GuestSettings {
    features_enabled: Record<string, boolean>;
    usage_limits: Record<string, number>;
}

export function useGuestSettings() {
    return useQuery<GuestSettings, Error>({
        queryKey: ['guestSettings'],
        queryFn: async () => {
            const response = await api.get('/settings/guest');
            return response.data;
        },
        staleTime: 15 * 60 * 1000, // Cache guest settings for 15 minutes
        refetchOnWindowFocus: false,
    });
}