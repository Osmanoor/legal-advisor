// src/hooks/api/useChat.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
// Import the corrected and updated types
import { ChatMessage, ChatSession, ChatOptions, NewChatSessionResponse } from '@/types/chat';

// --- API Functions ---
// These function definitions remain the same, but the return types are now correct.

const fetchChatSessions = async (): Promise<ChatSession[]> => {
  const response = await api.get('/chat/sessions');
  return response.data;
};

const fetchChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  const response = await api.get(`/chat/sessions/${sessionId}`);
  return response.data;
};

const startNewChat = async (variables: { message: string; options: ChatOptions }): Promise<NewChatSessionResponse> => {
    const response = await api.post('/chat/sessions/new', variables);
    return response.data;
};

const sendMessage = async (variables: { sessionId: string; message: string; options: ChatOptions }): Promise<ChatMessage> => {
    const { sessionId, ...payload } = variables;
    const response = await api.post(`/chat/sessions/${sessionId}/message`, payload);
    return response.data;
};

const deleteSession = async (sessionId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/chat/sessions/${sessionId}`);
    return response.data;
};


// --- The Main Hook ---
// The logic inside this hook is already correct and does not need to change.
// It will now simply work because the data it receives matches the types it expects.
export function useChat() {
  const queryClient = useQueryClient();

  const useChatSessions = () => useQuery<ChatSession[], Error>({
    queryKey: ['chat', 'sessions'],
    queryFn: fetchChatSessions,
  });

  const useChatMessages = (sessionId: string | null) => useQuery<ChatMessage[], Error>({
    queryKey: ['chat', 'messages', sessionId],
    queryFn: () => fetchChatMessages(sessionId!),
    enabled: !!sessionId,
  });

  const startNewChatMutation = useMutation({
    mutationFn: startNewChat,
    onSuccess: (newSessionData) => {
      queryClient.setQueryData(['chat', 'messages', newSessionData.id], newSessionData.messages);
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (newAssistantMessage, variables) => {
      const { sessionId } = variables;
      queryClient.setQueryData<ChatMessage[]>(['chat', 'messages', sessionId], (oldData) => {
          if (!oldData) return [];
          return [...oldData, newAssistantMessage];
      });
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    },
  });
  
  const deleteSessionMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    }
  });

  return {
    useChatSessions,
    useChatMessages,
    startNewChatMutation,
    sendMessageMutation,
    deleteSessionMutation
  };
}