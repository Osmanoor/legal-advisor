// src/types/api.ts
export interface ApiError {
    message: string;
    code: string;
    status: number;
  }
  
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
  }