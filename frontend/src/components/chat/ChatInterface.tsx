// ChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  language: 'ar' | 'en';
  loading: boolean;
}

const ChatInterface: React.FC<Props> = ({ messages, onSendMessage, language, loading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (formRef.current) {
      const height = formRef.current.offsetHeight;
      setFormHeight(height);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative h-screen flex justify-center">
      {/* Messages Container with max width */}
      <div 
        className="absolute top-0 bottom-0 w-full max-w-3xl mx-auto overflow-y-auto pb-[88px] px-4 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="space-y-4 py-4">
          {messages.map((message, index) => (
            <MessageBubble 
              key={index}
              message={message}
              language={language}
            />
          ))}
          {loading && <LoadingIndicator language={language} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Form with max width */}
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="fixed bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900/95 backdrop-blur-sm"
      >
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-6 py-4 pr-[120px] rounded-xl bg-slate-800/50 border-2 border-slate-700 focus:border-blue-500 focus:outline-none text-lg text-white placeholder-slate-400 shadow-lg"
              placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <button
              type="submit"
              className={`absolute ${language === 'ar' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all`}
            >
              {language === 'ar' ? (
                <>
                  <Send size={18} />
                  <span>إرسال</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;