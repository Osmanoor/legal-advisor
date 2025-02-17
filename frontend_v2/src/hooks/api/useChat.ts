// src/hooks/api/useChat.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ChatMessage, ChatResponse, HistoryResponse, ChatOptions } from '@/types/chat';

export function useChat() {
  const queryClient = useQueryClient();

  const sendMessage = useMutation<
    ChatResponse,
    Error,
    { message: string; options: ChatOptions }
  >({
    mutationFn: async ({ message, options }) => {
      const response = await api.post<ChatResponse>('/chat', {
        message,
        language: options.saudiAccent ? 'sa' : undefined,
        reasoning: options.reasoning,
        sessionId: localStorage.getItem('sessionId') || 'default'
      });
      
      console.log('API Response:', response.data); // Debug log
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    }
  });

  const chatHistory = useQuery<ChatMessage[]>({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const sessionId = localStorage.getItem('sessionId') || 'default';
      const response = await api.get<HistoryResponse>(`/chat/history?sessionId=${sessionId}`);
      return response.data.messages;
    }
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      const sessionId = localStorage.getItem('sessionId') || 'default';
      await api.delete(`/chat/history?sessionId=${sessionId}`);
    },
    onSuccess: () => {
      // Fixed: Use proper invalidation syntax
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    }
  });

  // Initialize or get session ID
  const initializeSession = () => {
    if (!localStorage.getItem('sessionId')) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', sessionId);
    }
  };

  return {
    sendMessage,
    chatHistory,
    clearHistory,
    initializeSession
  };
}