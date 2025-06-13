// src/types/chat.ts

// Represents a reference or source for an assistant's answer
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

// Represents a single message in a conversation
export interface ChatMessage {
  id: string; // Unique ID for each message
  role: 'user' | 'assistant';
  content: string;
  resources?: Resource[];
  timestamp: string; // Using ISO string for consistency
}

// Represents a single chat session in the history
export interface ChatSession {
  id: string;
  title: string;
  lastUpdated: string; // ISO string
  questionCount: number;
}

// Represents the full data for an active chat, including its messages
export interface ActiveChat extends ChatSession {
  messages: ChatMessage[];
}

// For the API response when sending a message
export interface ChatResponse {
  answer: string;
  sources: Resource[];
  error?: string | null;
}

// Options sent with a message
export interface ChatOptions {
  saudiAccent: boolean;
  reasoning: boolean; // This can be removed if not used by the new design
}