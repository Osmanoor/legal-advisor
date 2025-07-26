// src/types/chat.ts

// This is your existing, correct Resource interface. It will be preserved.
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

// This is your existing, correct ChatMessage interface.
export interface ChatMessage {
  id: string; // Will now be a UUID from the database
  role: 'user' | 'assistant';
  content: string;
  resources?: Resource[];
  timestamp: string; // Will be `created_at` from the database
}

// --- NEW AND UPDATED TYPES FOR PERSISTENT CHAT ---

// Updated to match the backend response for a session list item
export interface ChatSession {
  id: string; // UUID from the database
  title: string;
  updated_at: string; // ISO string from the database
  questionCount: number; // The number of user questions in the session
}

// The data returned when starting a new chat session
export interface NewChatSessionResponse extends ChatSession {
    messages: ChatMessage[];
}

// Options sent with a message to the backend
export interface ChatOptions {
  language?: 'ar' | 'en' | 'sa';
  reasoning?: boolean;
}