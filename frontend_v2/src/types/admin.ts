// src/types/admin.ts
export interface Contact {
  Date: string;
  Name: string;
  Email: string;
  Message: string;
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