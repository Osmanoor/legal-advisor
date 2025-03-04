import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (message: string, accent: boolean, reasoning: boolean) => void;
  language: 'ar' | 'en';
  loading: boolean;
}

const ChatInterface: React.FC<Props> = ({ messages, onSendMessage, language, loading }) => {
  const [input, setInput] = useState('');
  const [useSaudiAccent, setUseSaudiAccent] = useState(false);
  const [useReasoning, setUseReasoning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input, useSaudiAccent, useReasoning);
      setInput('');
    }
  };

  // Update form height whenever the form content changes
  useEffect(() => {
    const updateFormHeight = () => {
      if (formRef.current) {
        const height = formRef.current.offsetHeight;
        setFormHeight(height);
      }
    };

    // Initial measurement
    updateFormHeight();

    // Set up resize observer to handle dynamic height changes
    const resizeObserver = new ResizeObserver(updateFormHeight);
    if (formRef.current) {
      resizeObserver.observe(formRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const CheckboxOption = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) => (
    <label
      className={`
        flex items-center cursor-pointer select-none rounded-md
        transition-colors duration-200
        ${
          checked
            ? `bg-blue-500 border-blue-500 text-white border-2`
            : 'bg-slate-800 border-slate-500 hover:bg-slate-700 hover:border-slate-600 border-2'
        }
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <div className="flex items-center py-2 px-4">
        <div
          className={`
            ${checked ? 'opacity-100' : 'opacity-0'}
            ${language === 'ar' ? 'order-2 ml-2' : 'order-1 mr-2'}
          `}
        >
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className={language === 'ar' ? 'order-1' : 'order-2'}>
          {label}
        </span>
      </div>
    </label>
  );

  return (
    <div className="relative h-screen flex justify-center">
      <div
        className="absolute top-0 bottom-0 w-full max-w-3xl mx-auto overflow-y-auto px-4 md:px-0"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: `${formHeight + 16}px`
        }}
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

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900/95 backdrop-blur-sm"
      >
        <div className="max-w-2xl mx-auto">
          <div className={`flex mb-2 gap-2 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
            <CheckboxOption
              checked={useSaudiAccent}
              onChange={setUseSaudiAccent}
              label={language === 'ar' ? 'لهجة سعودية' : 'Saudi Accent'}
            />
            <CheckboxOption
              checked={useReasoning}
              onChange={setUseReasoning}
              label={language === 'ar' ? 'التفكير المنطقي' : 'Reasoning'}
            />
          </div>
          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full px-6 py-4 rounded-xl bg-slate-800/50 border-2 border-slate-700 focus:border-blue-500 focus:outline-none text-lg text-white placeholder-slate-400 shadow-lg resize-none ${
                language === 'ar' ? 'pr-6 pl-[100px]' : 'pl-6 pr-[100px]'
              }`}
              placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />

            <button
              type="submit"
              className={`absolute ${language === 'ar' ? 'left-2' : 'right-2'} bottom-4 transform translate-y-1/4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all`}
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
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;