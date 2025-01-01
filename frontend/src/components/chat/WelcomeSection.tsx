import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeSection: React.FC<Props> = ({ language, onSuggestionClick }) => {
  const [customQuestion, setCustomQuestion] = useState('');

  const content = {
    ar: {
      title: 'المستشار الذكي في خدمتك',
      description: 'اطرح أسئلتك حول نظام المنافسات والمشتريات الحكومية',
      placeholder: 'اكتب سؤالك هنا...',
      sendButton: 'إرسال',
      or: 'أو اختر من الأسئلة المقترحة',
      suggestions: [
        'ما هي شروط التأهيل المسبق للمنافسات الحكومية؟',
        'كيف يتم تقييم العروض في المنافسات الحكومية؟',
        'ما هي مدة سريان الضمان النهائي؟'
      ]
    },
    en: {
      title: 'Government Procurement Community AI Assistant at Your Service',
      description: 'Ask your questions about Government Procurement Law',
      placeholder: 'Type your question here...',
      sendButton: 'Send',
      or: 'Or choose from suggested questions',
      suggestions: [
        'What are the pre-qualification requirements for government tenders?',
        'How are bids evaluated in government tenders?',
        'What is the validity period of the final guarantee?'
      ]
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim()) {
      onSuggestionClick(customQuestion);
    }
  };

  return (
    <div className="flex flex-col items-center py-12 px-4 text-white">
      <div className="w-36 h-36 rounded-full flex items-center justify-center mb-6">
        <img src='images/legal-bot-removebg.png' className="text-white" />
      </div>
      
      <h1 className="text-3xl font-bold text-center pb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        {content[language].title}
      </h1>
      <p className="text-slate-300 mb-8 text-center">{content[language].description}</p>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-12">
        <div className="relative">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder={content[language].placeholder}
            className="w-full px-6 py-4 pr-[120px] rounded-xl bg-slate-800/50 border-2 border-slate-700 focus:border-blue-500 focus:outline-none text-lg text-white placeholder-slate-400"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            <span>{content[language].sendButton}</span>
            <Send size={18} />
          </button>
        </div>
      </form>

      <div className="space-y-4 w-full max-w-4xl">
        <p className="text-center text-slate-400 mb-6">{content[language].or}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {content[language].suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="p-6 bg-slate-800/50 border-2 border-slate-700 rounded-xl hover:border-blue-500 transition-all text-start group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;