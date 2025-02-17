// src/services/api/types.ts
export interface ApiError {
    message: string;
    code: string;
    status: number;
  }
  
  export type ApiResponse<T> = {
    data: T;
    message?: string;
    status: number;
  };