// src/hooks/api/useChat.ts
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { ChatMessage, ChatSession, ChatOptions, Resource } from '@/types/chat';

// --- MOCK DATA ---
const createDummySessions = (): ChatSession[] => [
  { id: 'session_1', title: 'شروط التأهيل المسبق للمنافسات الحكومية', lastUpdated: new Date().toISOString(), questionCount: 3 },
  { id: 'session_2', title: 'كيفية تقييم العروض والترسية', lastUpdated: new Date(Date.now() - 86400000).toISOString(), questionCount: 5 },
  { id: 'session_3', title: 'مدة سريان الضمان النهائي وشروطه', lastUpdated: new Date(Date.now() - 172800000).toISOString(), questionCount: 2 },
];

const createDummyMessages = (): Record<string, ChatMessage[]> => ({
  session_1: [
    { id: 'msg1_1', role: 'user', content: 'ما هي شروط التأهيل المسبق للمنافسات الحكومية؟', timestamp: new Date(Date.now() - 60000 * 5).toISOString() },
    {
      id: 'msg1_2',
      role: 'assistant',
      content: 'يجب على الجهة الحكومية عند إعداد وثائق المنافسة تحديد شروط التأهيل المسبق اللازمة لضمان قدرة المتنافسين على تنفيذ العقد، وذلك وفقًا للمادة 24 من نظام المنافسات.',
      resources: [
        { content: 'تنص المادة الرابعة والعشرون على أن الجهة الحكومية يجب أن تضع معايير واضحة وموضوعية...', metadata: { article_number: 24, article_type: 'نظام', chapter_name: 'التأهيل', chapter_number: 3, section_name: 'الشروط', section_number: 1, summary: 'شروط التأهيل المسبق' } },
      ],
      timestamp: new Date(Date.now() - 60000 * 4).toISOString(),
    },
    { id: 'msg1_3', role: 'user', content: 'وهل يمكن الطعن في نتائج التأهيل؟', timestamp: new Date(Date.now() - 60000 * 3).toISOString() },
  ],
  session_2: [{ id: 'msg2_1', role: 'user', content: 'كيف يتم تقييم العروض؟', timestamp: new Date(Date.now() - 86400000 * 1.1).toISOString() }],
  session_3: [{ id: 'msg3_1', role: 'user', content: 'ما هي مدة سريان الضمان النهائي؟', timestamp: new Date(Date.now() - 172800000 * 1.1).toISOString() }],
});
// --- END MOCK DATA ---


// --- ZUSTAND STORE ---
interface ChatState {
  sessions: ChatSession[];
  messages: Record<string, ChatMessage[]>;
  isInitialized: boolean;
  initStore: () => void;
  addMessage: (sessionId: string, content: string, options: ChatOptions) => Promise<ChatMessage>;
  createNewSession: (firstMessage: string, options: ChatOptions) => Promise<string>;
}

const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  messages: {},
  isInitialized: false,

  // Action to initialize the store with mock data
  initStore: () => {
    if (get().isInitialized) return;
    set({
      sessions: createDummySessions(),
      messages: createDummyMessages(),
      isInitialized: true,
    });
  },

  // Action to add a message to an existing session
  addMessage: async (sessionId, content, options) => {
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // Update state with user message immediately
    set(state => ({
      messages: {
        ...state.messages,
        [sessionId]: [...(state.messages[sessionId] || []), userMessage],
      },
      sessions: state.sessions.map(s => s.id === sessionId 
        ? { ...s, questionCount: s.questionCount + 1, lastUpdated: new Date().toISOString() } 
        : s
      ),
    }));

    // Simulate async assistant response
    await new Promise(res => setTimeout(res, 1500));
    
    const assistantResponse: ChatMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant',
      content: `هذا رد تلقائي على سؤالك: "${content}". ${options.saudiAccent ? 'لهجة سعودية مفعلة.' : ''}`,
      resources: [],
      timestamp: new Date().toISOString(),
    };

    // Update state with assistant message
    set(state => ({
      messages: {
        ...state.messages,
        [sessionId]: [...(state.messages[sessionId] || []), assistantResponse],
      },
    }));

    return assistantResponse;
  },

  // Action to create a new session
  createNewSession: async (firstMessage, options) => {
    const newSessionId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: firstMessage.length > 50 ? firstMessage.substring(0, 47) + '...' : firstMessage,
      lastUpdated: new Date().toISOString(),
      questionCount: 0, // Will be incremented by addMessage
    };

    set(state => ({
      sessions: [newSession, ...state.sessions],
      messages: { ...state.messages, [newSessionId]: [] }
    }));

    await get().addMessage(newSessionId, firstMessage, options);
    
    return newSessionId;
  },
}));

// --- MAIN HOOK ---
export function useChat() {
  const queryClient = useQueryClient();
  const store = useChatStore();

  // Initialize the store with mock data only once
  useEffect(() => {
    store.initStore();
  }, []);

  // Query to get all sessions from the store
  const sessionsQuery = useQuery({
    queryKey: ['chat', 'sessions'],
    queryFn: async () => useChatStore.getState().sessions.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()),
    // This query depends on the store's state, but we can trigger refetches manually or via invalidation
  });

  // Query to get messages for a specific session
  const messagesQuery = (sessionId: string | null) => useQuery({
    queryKey: ['chat', 'messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      return useChatStore.getState().messages[sessionId] || [];
    },
    enabled: !!sessionId,
  });

  // Mutation to send a message
  const sendMessageMutation = useMutation({
    mutationFn: (variables: { sessionId: string; content: string; options: ChatOptions }) => 
      store.addMessage(variables.sessionId, variables.content, variables.options),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    },
  });

  // Mutation to start a new chat
  const startNewChatMutation = useMutation({
    mutationFn: (variables: { content: string; options: ChatOptions }) =>
      store.createNewSession(variables.content, variables.options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    },
  });
  
  return {
    sessionsQuery,
    messagesQuery,
    sendMessage: sendMessageMutation,
    startNewChat: startNewChatMutation,
  };
}