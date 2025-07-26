// src/hooks/api/useChat.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ChatMessage, ChatSession, ChatOptions, NewChatSessionResponse } from '@/types/chat';
import { trackEvent } from '@/lib/analytics';

// --- API Functions ---
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
      trackEvent({ event: 'feature_used', feature_name: 'ai_assistant' });
      // --- FIX: Use the new structured response to populate the cache ---
      // This places the guaranteed-order messages into the cache for the new session ID.
      queryClient.setQueryData(['chat', 'messages', newSessionData.id], newSessionData.messages);
      
      // Add the new session to the session list without a full refetch for a faster UI update.
      queryClient.setQueryData<ChatSession[]>(['chat', 'sessions'], (oldSessions) => {
        const newSessionEntry = {
          id: newSessionData.id,
          title: newSessionData.title,
          updated_at: newSessionData.updated_at,
          questionCount: newSessionData.questionCount,
        };
        return oldSessions ? [newSessionEntry, ...oldSessions] : [newSessionEntry];
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (newAssistantMessage, variables) => {
      trackEvent({ event: 'feature_used', feature_name: 'ai_assistant' });
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