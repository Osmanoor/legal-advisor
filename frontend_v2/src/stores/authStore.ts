// src/stores/authStore.ts

import { create } from 'zustand';
import { api } from '@/lib/axios';
import { AuthState, LoginCredentials, RegisterData, User, VerificationData } from '@/types/user';

// Add new state and actions to the AuthState type
export interface ExtendedAuthState extends AuthState {
  isOnboarding: boolean;
  completeOnboarding: () => void;
}

export const useAuthStore = create<ExtendedAuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true, // This is for the initial app load check
  isOnboarding: false, // Default to false

  checkAuthStatus: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<User>('/auth/me');
      set({ isAuthenticated: true, user: response.data, isLoading: false, isOnboarding: false });
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false, isOnboarding: false });
    }
  },

  login: async (credentials) => {
    // On a normal login, onboarding is always false.
    try {
      const response = await api.post('/auth/login', credentials);
      set({ isAuthenticated: true, user: response.data.user, isOnboarding: false });
    } catch (error) {
      set({ isAuthenticated: false, user: null });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ isAuthenticated: false, user: null, isOnboarding: false });
    }
  },

  register: async (data) => {
    // This function only makes the API call. It doesn't set any state.
    await api.post('/auth/register', data);
  },
  
  // On successful verification, we set the user and flag that they are in the onboarding flow.
  verifyPhone: async (data) => {
    try {
      const response = await api.post('/auth/verify', data);
      set({ 
        isAuthenticated: true, 
        user: response.data.user, 
        isOnboarding: true // The user is logged in but needs to complete the final step.
      });
    } catch (error) {
      throw error;
    }
  },

  // New action to be called when the user finishes the last step.
  completeOnboarding: () => {
    set({ isOnboarding: false });
  },
}));