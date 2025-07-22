// src/hooks/usePermission.ts

import { useAuthStore } from "@/stores/authStore";
import { Permission } from "@/types/user";
import { useGuestSettings } from "./api/useGuestSettings";

export function usePermission() {
    const { isAuthenticated, user } = useAuthStore();
    const { data: guestSettings, isLoading: isLoadingGuestSettings } = useGuestSettings();

    const canAccess = (permission: Permission): boolean => {
        // If user is authenticated, check their permissions array
        if (isAuthenticated && user) {
            return user.permissions.includes(permission);
        }
        
        // If user is a guest, check the fetched guest settings
        if (!isAuthenticated && guestSettings) {
            return guestSettings.features_enabled[permission] ?? false;
        }

        // Default to false if settings are not loaded or in an invalid state
        return false;
    };

    return { 
        canAccess, 
        // isLoading is true only when we are waiting for guest settings for an unauthenticated user
        isLoading: !isAuthenticated && isLoadingGuestSettings 
    };
}