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