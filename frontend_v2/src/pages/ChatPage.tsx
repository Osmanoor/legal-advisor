// src/pages/ChatPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { ChatInterface } from '@/features/chat/components/ChatInterface';
import { WelcomeSection } from '@/features/chat/components/WelcomeSection';
import { ChatMessage, ChatOptions } from '@/types/chat';
import { useChat } from '@/hooks/api/useChat';
import { useLanguage } from '@/hooks/useLanguage';

export default function ChatPage() {
  const { t, language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    sendMessage,
    chatHistory,
    initializeSession
  } = useChat();

  // Initialize chat session
  useEffect(() => {
    initializeSession();
  }, []);

  // Load chat history
  useEffect(() => {
    if (chatHistory.data) {
      setMessages(chatHistory.data);
    }
  }, [chatHistory.data]);

  const handleSendMessage = async (message: string, options: ChatOptions) => {
    try {
      setIsLoading(true);
      
      // Add user message immediately
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Send message to API
      const response = await sendMessage.mutateAsync({ message, options });
      console.log('Received response:', response); // Debug log

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        resources: response.sources,
        timestamp: new Date()
      };
      console.log('Created assistant message:', assistantMessage); // Debug log
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion, {
      saudiAccent: false,
      reasoning: false
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white ${
      language === 'ar' ? 'text-right' : 'text-left'
    }`}>
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link 
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-colors"
          >
            {t('procurement.communityName')}
          </Link>
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
          >
            <Languages size={20} />
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {messages.length === 0 ? (
          <WelcomeSection 
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading || chatHistory.isLoading}
          />
        )}
      </main>
    </div>
  );
}