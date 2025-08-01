// src/hooks/api/useChat.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ChatMessage, ChatSession, ChatOptions, NewChatSessionResponse } from '@/types/chat';
import { trackEvent } from '@/lib/analytics';

// --- MODIFICATION START: Define payload for starting a chat ---
interface StartChatPayload {
    message: string;
    options: ChatOptions;
    history?: { role: 'user' | 'assistant', content: string }[];
}
// --- MODIFICATION END ---

const fetchChatSessions = async (): Promise<ChatSession[]> => {
  const response = await api.get('/chat/sessions');
  return response.data;
};

const fetchChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  const response = await api.get(`/chat/sessions/${sessionId}`);
  return response.data;
};

// --- MODIFICATION START: Update function signature ---
const startNewChat = async (variables: StartChatPayload): Promise<NewChatSessionResponse> => {
    const response = await api.post('/chat/sessions/new', variables);
    return response.data;
};
// --- MODIFICATION END ---

const sendMessage = async (variables: { sessionId: string; message: string; options: ChatOptions }): Promise<ChatMessage> => {
    const { sessionId, ...payload } = variables;
    const response = await api.post(`/chat/sessions/${sessionId}/message`, payload);
    return response.data;
};

const deleteSession = async (sessionId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/chat/sessions/${sessionId}`);
    return response.data;
};


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
      
      // --- MODIFICATION START: Handle both guest and user responses ---
      if (newSessionData.id) { // This is a logged-in user with a new session
        queryClient.setQueryData(['chat', 'messages', newSessionData.id], newSessionData.messages);
        
        queryClient.setQueryData<ChatSession[]>(['chat', 'sessions'], (oldSessions) => {
          const newSessionEntry = {
            id: newSessionData.id!,
            title: newSessionData.title!,
            updated_at: newSessionData.updated_at!,
            questionCount: newSessionData.questionCount!,
          };
          return oldSessions ? [newSessionEntry, ...oldSessions] : [newSessionEntry];
        });
      }
      // For guests, we don't need to touch the query cache. The component will handle the state locally.
      // --- MODIFICATION END ---
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