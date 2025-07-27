// File: src/types/user.ts

// The Role type is now a generic string, as it's fetched dynamically.
export type Role = string;

// The permissions as defined in the backend's seeding script
export type Permission =
  // User-facing features
  | 'access_chat'
  | 'access_calculator'
  | 'access_text_corrector'
  | 'access_report_generator'
  | 'access_search_tool'
  | 'access_feedback'
  
  // Admin-facing features (Page/Component Access)
  | 'view_analytics'
  | 'manage_users'
  | 'manage_feedback'
  | 'manage_contacts'
  | 'manage_global_settings'
  
  // Granular Admin actions (API endpoint protection)
  | 'update_user'
  | 'delete_user'
  | 'update_admin'
  ;

// Base user object from /me endpoint
export interface User {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  jobTitle: string | null;
  workplace: string | null;
  linkedin_id: string | null;
  profile_picture_url: string | null;
  roles: string[];
  permissions: Permission[];
}

// --- More specific types for Admin Panel ---
export interface UserSummary {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  roles: string[];
  created_at: string;
  status: 'active' | 'suspended';
}

export interface PermissionOverride {
  permission_id: number;
  permission_name: string;
  override_type: 'ALLOW' | 'DENY';
}

export interface UserRole {
  id: number;
  name: string;
}

export interface AdminDetailedUser {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  jobTitle: string | null;
  roles: UserRole[];
  permission_overrides: PermissionOverride[];
  created_at: string;
  status: 'active' | 'suspended';
}

export interface UserUpdatePayload {
  fullName?: string;
  email?: string;
  jobTitle?: string;
  status?: 'active' | 'suspended';
  role_ids?: number[];
  permission_overrides?: {
      permission_id: number;
      override_type: 'ALLOW' | 'DENY';
  }[];
}

// --- NEW: Payload for creating a user ---
export interface UserCreatePayload {
  fullName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  jobTitle?: string;
  role_id: number;
}

// --- Existing types ---
export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface LoginCredentials {
  loginIdentifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  password: string;
  email?: string;
  phoneNumber?: string;
}

export interface VerificationData {
  identifier: string;
  code: string;
}

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