// src/types/user.ts

// The Role type is now a generic string, as it's fetched dynamically.
export type Role = string;

// The permissions as defined in the backend's seeding script
export type Permission =
  | 'access_ai_assistant'
  | 'access_calculator'
  | 'access_text_corrector'
  | 'access_report_generator'
  | 'access_search_tool'
  | 'access_admin_dashboard'
  | 'access_ratings_management'
  | 'access_contact_us'
  | 'view_users_list'
  | 'delete_user'
  | 'manage_admins'
  | 'access_global_settings';

// Updated User interface to match the backend's /me response
export interface User {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  jobTitle: string | null;
  roles: Role[]; // This is now string[]
  permissions: Permission[];
}

// Login credentials
export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

// Register data
export interface RegisterData {
  fullName: string;
  phoneNumber: string;
  password: string;
}

// Phone verification payload
export interface VerificationData {
  phoneNumber: string;
  code: string;
}

// Auth store state shape
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyPhone: (data: VerificationData) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}