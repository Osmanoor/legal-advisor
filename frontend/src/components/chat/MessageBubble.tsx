import React from 'react';
import { ChatMessage } from '../../types/chat';
import ResourceCard from './ResourceCard';

interface Props {
  message: ChatMessage;
  language: 'ar' | 'en';
}

const MessageBubble: React.FC<Props> = ({ message, language }) => {
  const isUser = message.role === 'user';
  const alignmentClass = isUser 
    ? language === 'ar' ? 'ml-auto' : 'mr-auto'
    : language === 'ar' ? 'mr-auto' : 'ml-auto';
  const bubbleClass = isUser
    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
    : 'bg-slate-800/50 border border-slate-700 text-white';

  return (
    <div className={`max-w-[80%] ${alignmentClass}`}>
      <div 
        className={`rounded-2xl px-4 py-2 ${bubbleClass}`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <p className="whitespace-pre-wrap unicode-bidi-override">
          {message.content}
        </p>
      </div>
      
      {message.resources && message.resources.length > 0 && (
        <div 
          className="mt-4 space-y-2"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <h4 className="text-sm text-slate-400">
            {language === 'ar' ? 'المصادر\u200F:' : 'Sources:'}
          </h4>
          <div className="space-y-2">
            {message.resources.map((resource, index) => (
              <ResourceCard
                key={index}
                resource={resource}
                language={language}
              />
            ))}
          </div>
        </div>
      )}
      
      <div 
        className="text-xs text-slate-400 mt-1"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {new Date(message.timestamp).toLocaleTimeString(
          language === 'ar' ? 'ar-SA' : 'en-US'
        )}
      </div>
    </div>
  );
};

export default MessageBubble;