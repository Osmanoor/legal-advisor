// src/stores/authStore.ts

import { create } from 'zustand';
import { api } from '@/lib/axios';
import { AuthState, LoginCredentials, RegisterData, User, VerificationData } from '@/types/user';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true, // Start with loading true for initial check

  checkAuthStatus: async () => {
    // We set isLoading to true at the beginning of the check
    set({ isLoading: true });
    try {
      const response = await api.get<User>('/auth/me');
      if (response.data) {
        set({ isAuthenticated: true, user: response.data, isLoading: false });
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', credentials);
      set({ isAuthenticated: true, user: response.data.user, isLoading: false });
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/register', data);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyPhone: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/verify-phone', data);
      set({ isAuthenticated: true, user: response.data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    // No need to set isLoading here, as the UI won't typically show a loading state for logout.
    // If it does, we can add set({ isLoading: true })
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout API call failed, but clearing local state.", error);
    } finally {
      // Always clear the local state on logout.
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },
}));

// REMOVED THE PROBLEMATIC LINE FROM HERE:
// useAuthStore.getState().checkAuthStatus();