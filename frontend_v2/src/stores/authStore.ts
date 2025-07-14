// File: src/stores/authStore.ts
// @checked
// This new store manages the global authentication state.

import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterData, User } from '@/types/user';

// Mock API calls
const mockApi = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    console.log('Mock Login:', credentials.email);
    await new Promise(res => setTimeout(res, 1000));
    if (credentials.email === "error@test.com") {
      throw new Error("Invalid credentials");
    }
    // Simulate a successful login
    return {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name: 'Amjed Mohammed',
        email: credentials.email,
        role: 'admin', // Assume admin for testing purposes
        permissions: ['manage:users', 'read:analytics']
      }
    };
  },
  register: async (data: RegisterData): Promise<{ message: string }> => {
    console.log('Mock Register:', data.email);
    await new Promise(res => setTimeout(res, 1000));
    if (data.email === "exists@test.com") {
      throw new Error("Email already exists");
    }
    return { message: 'Registration successful. Please confirm your email.' };
  },
  logout: async () => {
    console.log('Mock Logout');
    await new Promise(res => setTimeout(res, 500));
  },
  checkStatus: async (token: string): Promise<User | null> => {
     console.log('Mock Check Auth Status with token:', token);
     await new Promise(res => setTimeout(res, 500));
     if (token === 'mock-jwt-token') {
       return {
         id: '1',
         name: 'Amjed Mohammed',
         email: 'user@test.com',
         role: 'admin',
         permissions: ['manage:users', 'read:analytics']
       };
     }
     return null;
  }
};


export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true, // Start with loading true for initial check

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { token, user } = await mockApi.login(credentials);
      localStorage.setItem('authToken', token);
      set({ isAuthenticated: true, user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await mockApi.logout();
    localStorage.removeItem('authToken');
    set({ isAuthenticated: false, user: null, isLoading: false });
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      await mockApi.register(data);
      // On successful registration, we don't log the user in.
      // The UI will redirect them to the confirmation page.
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuthStatus: async () => {
    set({ isLoading: true });
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const user = await mockApi.checkStatus(token);
        if (user) {
          set({ isAuthenticated: true, user, isLoading: false });
        } else {
          // Token is invalid
          localStorage.removeItem('authToken');
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } else {
      set({ isLoading: false }); // No token found
    }
  },
}));

// Initialize auth check when app loads
useAuthStore.getState().checkAuthStatus();