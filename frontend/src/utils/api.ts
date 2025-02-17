import { Console } from 'console';
import { ChatMessage, Resource } from '../types/chat';
import { SearchParams, SearchResponse } from '../types/search';


// API response types
interface ChatResponse {
  answer: string;
  sources: {
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
  }[];
  error?: string | null;
}

interface HistoryResponse {
  messages: ChatMessage[];
  error?: string;
}

interface LanguageResponse {
  language: 'ar' | 'en';
  error?: string;
}

// API configuration
const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8080/api',
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  throw error instanceof Error ? error : new Error(String(error));
};

// Helper function to check response
const checkResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Main API service
export const searchResources = async ({ query, type }: SearchParams): Promise<SearchResponse> => {
  const params = new URLSearchParams({ query });
  if (type && type !== 'Both') {
    params.append('type', type);
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Search request failed');
  }

  return response.json();
};

export const chatService = {
  // Send a message and get response
  async sendMessage(message: string, language: 'ar' | 'en' | 'sa', reasoning:boolean): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/chat`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          message,
          language,
          reasoning,
          sessionId: localStorage.getItem('sessionId') || 'default'
        }),
      });
  
      const data = await checkResponse(response);
      console.log("JSON Data:", data)
      // No need to transform the response as it already matches our interface
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get chat history
  async getMessageHistory(): Promise<ChatMessage[]> {
    try {
      const sessionId = localStorage.getItem('sessionId') || 'default';
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/chat/history?sessionId=${sessionId}`,
        {
          headers: API_CONFIG.HEADERS,
        }
      );

      const data: HistoryResponse = await checkResponse(response);
      return data.messages || [];
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Clear chat history
  async clearHistory(): Promise<void> {
    try {
      const sessionId = localStorage.getItem('sessionId') || 'default';
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/chat/history?sessionId=${sessionId}`,
        {
          method: 'DELETE',
          headers: API_CONFIG.HEADERS,
        }
      );

      await checkResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get current language
  async getLanguage(): Promise<'ar' | 'en'> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/language`,
        {
          headers: API_CONFIG.HEADERS,
        }
      );

      const data: LanguageResponse = await checkResponse(response);
      return data.language;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Set language preference
  async setLanguage(language: 'ar' | 'en'): Promise<void> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/language`,
        {
          method: 'PUT',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({ language }),
        }
      );

      await checkResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Generate a new session ID
  generateSessionId(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
  },

  // Initialize the chat service
  initialize(): void {
    if (!localStorage.getItem('sessionId')) {
      this.generateSessionId();
    }
  }
};

// Initialize the chat service when imported
chatService.initialize();

export default chatService;