// src/types/admin.ts

export interface Contact {
  Date: string;
  Name: string;
  Email: string;
  Message: string;
}

export interface Email {
  Date: string;
  Recipient: string;
  Subject: string;
  Body: string;
  Attachment: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
}

export interface ContactSubmitResponse extends ApiResponse {
  message?: string;
}

// --- Types for Global Settings ---
export interface GlobalSettings {
  guest_permissions: RoleSettings;
  registered_user_permissions: RoleSettings;
  admin_permissions: RoleSettings;
}

export interface RoleSettings {
  features_enabled: Record<string, boolean>;
  usage_limits: Record<string, number>;
  data_limits?: Record<string, number>;
}

export interface AllPermissions {
    id: number;
    name: string;
    description: string;
}

// --- FIX: This is the correct shape of the response ---
export interface RolesAndPermissionsResponse {
  roles: { id: number; name: string }[];
  all_permissions: {
    user: AllPermissions[];
    admin: AllPermissions[];
  };
}

// --- FIX: This is the correct shape for the entire settings payload ---
export interface AllSettingsResponse extends RolesAndPermissionsResponse {
    global_settings: GlobalSettings;
}