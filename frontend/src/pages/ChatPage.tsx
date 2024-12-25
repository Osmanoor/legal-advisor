// ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatInterface from '../components/chat/ChatInterface';
import WelcomeSection from '../components/chat/WelcomeSection';
import { ChatMessage } from '../types/chat';
import { chatService } from '../utils/api';
import { useLanguage } from '../LanguageContext';

const ChatPage: React.FC = () => {
  const {language, setLanguage} = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial language
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await chatService.getLanguage();
        setLanguage(savedLanguage);
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLanguage();
  }, []);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatService.getMessageHistory();
        setMessages(history);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadHistory();
  }, []);

  // Handle sending message
  const handleSendMessage = async (message: string) => {
    try {
      setLoading(true);

      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await chatService.sendMessage(message, language);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        resources: response.sources,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle language change
  const handleLanguageChange = async (newLanguage: 'ar' | 'en') => {
    try {
      await chatService.setLanguage(newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link 
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-colors"
          >
            {language === 'ar' ? "مجتمع المشتريات الحكومية" : "Government Procurement Community"}
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        {messages.length === 0 ? (
          <WelcomeSection 
            language={language}
            onSuggestionClick={handleSendMessage}
          />
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            language={language}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
};

export default ChatPage;