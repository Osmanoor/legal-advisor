// src/types/chat.ts

export interface Resource {
  content: string;
  metadata: {
    article_number: number;
    article_type: string; 
    chapter_name: string;
    chapter_number: number;
    section_name: string;
    section_number: number;
    summary: string;
  };
}

export interface ChatMessage {
  id: string; 
  role: 'user' | 'assistant';
  content: string;
  resources?: Resource[];
  timestamp: string;
}

export interface ChatSession {
  id: string; 
  title: string;
  updated_at: string;
  questionCount: number; 
}

// --- MODIFICATION START: Update response type ---
// This interface now represents the response for BOTH guests and users.
// For guests, the top-level properties (id, title, etc.) will be undefined.
export interface NewChatSessionResponse {
    id?: string;
    title?: string;
    updated_at?: string;
    questionCount?: number;
    messages: ChatMessage[];
}
// --- MODIFICATION END ---

export interface ChatOptions {
  language?: 'ar' | 'en' | 'sa';
  reasoning?: boolean;
}