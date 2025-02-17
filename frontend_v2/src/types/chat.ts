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
  role: 'user' | 'assistant';
  content: string;
  resources?: Resource[];
  timestamp: Date;
}

export interface ChatResponse {
  answer: string;
  sources: Resource[];
  error?: string | null;
}

export interface HistoryResponse {
  messages: ChatMessage[];
  error?: string;
}

export interface ChatOptions {
  saudiAccent: boolean;
  reasoning: boolean;
}