// src/types/correction.ts
export interface CorrectionRequest {
    text: string;
    language: 'ar' | 'en';
    mode?: 'correct' | 'enhance'; // <-- ADD THIS LINE
  }
  
export  interface CorrectionResponse {
    corrected_text: string;
    status: 'success' | 'error';
    error?: string;
  }