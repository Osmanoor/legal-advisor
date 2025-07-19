// src/hooks/api/useUserProfile.ts

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types/user';

interface ProfileUpdatePayload {
  fullName?: string;
  email?: string;
  jobTitle?: string;
  linkedin?: string;
  workplace?: string;
}

interface AvatarUploadResponse {
    profile_picture_url: string;
}

export function useUserProfile() {

  const updateUserProfileMutation = useMutation<User, Error, ProfileUpdatePayload>({
    mutationFn: async (payload) => {
      // The backend's PUT /api/auth/profile endpoint should return the full, updated user object.
      const response = await api.put('/auth/profile', payload);
      return response.data;
    },
    // --- FIX: Add the onSuccess handler to update the store ---
    onSuccess: (updatedUser) => {
      // When the mutation is successful, update the global state.
      // This will cause all components subscribed to the store to re-render.
      useAuthStore.setState({ user: updatedUser });
    },
  });

  const uploadAvatarMutation = useMutation<AvatarUploadResponse, Error, File>({
    mutationFn: async (avatarFile) => {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await api.post('/auth/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    onSuccess: (data) => {
        // Here, we only get the URL back. We patch the existing user object in the store.
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
            useAuthStore.setState({
                user: {
                    ...currentUser,
                    profile_picture_url: data.profile_picture_url,
                }
            });
        }
    }
  });

  return {
    updateUserProfileMutation,
    uploadAvatarMutation,
  };
}