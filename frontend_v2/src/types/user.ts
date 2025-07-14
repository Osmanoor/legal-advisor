// File: src/types/user.ts
// @checked
// This new file defines the core data structures for users and authentication.

export type Role = 'user' | 'admin';

export type Permission = 
  | 'read:analytics'
  | 'manage:users'
  | 'manage:roles'
  | 'manage:feedback'
  | 'manage:content';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// The state shape for our authentication store
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}