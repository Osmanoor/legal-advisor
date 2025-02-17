export interface CorrectionRequest {
    text: string;
    language: 'ar' | 'en';
  }
  
export  interface CorrectionResponse {
    corrected_text: string;
    status: 'success' | 'error';
    error?: string;
  }