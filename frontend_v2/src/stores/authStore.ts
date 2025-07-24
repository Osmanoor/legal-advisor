// src/stores/authStore.ts

import { create } from 'zustand';
import { api } from '@/lib/axios';
import { AuthState, LoginCredentials, RegisterData, User, VerificationData } from '@/types/user';
import ReactGA from 'react-ga4';
import { trackEvent } from '@/lib/analytics';

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
      const user = response.data;
      set({ isAuthenticated: true, user: user, isLoading: false, isOnboarding: false });
      
      // GA: Set user ID on successful auth check
      if (ReactGA.isInitialized) {
        ReactGA.set({ user_id: user.id });
        console.log(`[GA Event] User ID set: ${user.id}`);
        trackEvent({ event: 'login' });
      }

    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false, isOnboarding: false });
      
      // GA: Clear user ID on failed auth check
      if (ReactGA.isInitialized) {
        ReactGA.set({ user_id: null });
        console.log(`[GA Event] User ID cleared on auth failure.`);
      }
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const user = response.data.user;
      set({ isAuthenticated: true, user: user, isOnboarding: false });
      
      // GA: Set user ID on successful login
       if (ReactGA.isInitialized) {
        ReactGA.set({ user_id: user.id });
        console.log(`[GA Event] User ID set: ${user.id}`);
        trackEvent({ event: 'login' });
      }

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

      // GA: Clear user ID on logout
      if (ReactGA.isInitialized) {
        ReactGA.set({ user_id: null });
        console.log(`[GA Event] User ID cleared on logout.`);
      }
    }
  },

  register: async (data) => {
    // This function only makes the API call. It doesn't set any state.
    await api.post('/auth/register', data);
  },
  
  verifyPhone: async (data) => {
    try {
      const response = await api.post('/auth/verify', data);
      const user = response.data.user;
      set({ 
        isAuthenticated: true, 
        user: user, 
        isOnboarding: true
      });

      // GA: Set user ID on successful verification (which is a login)
      if (ReactGA.isInitialized) {
        ReactGA.set({ user_id: user.id });
        console.log(`[GA Event] User ID set: ${user.id}`);
        trackEvent({ event: 'login' });
      }
    } catch (error) {
      throw error;
    }
  },

  completeOnboarding: () => {
    set({ isOnboarding: false });
  },
}));