// // src/features/chat/components/ChatInterface.tsx
// import { useRef, useEffect } from 'react';
// // Removed Send from lucide-react as it's in ChatInputBar
// import { useLanguage } from '@/hooks/useLanguage';
// import { ChatMessage, ChatOptions } from '@/types';
// import { MessageBubble } from './MessageBubble';
// import { LoadingIndicator } from './LoadingIndicator';
// import { ChatInputBar } from './ChatInputBar'; // Added import

// interface ChatInterfaceProps {
//   messages: ChatMessage[];
//   onSendMessage: (message: string, options: ChatOptions) => void;
//   isLoading: boolean;
// }

// export function ChatInterface({ 
//   messages, 
//   onSendMessage, 
//   isLoading 
// }: ChatInterfaceProps) {
//   const { t, direction } = useLanguage(); // direction might be used by MessageBubble or other child components
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   // Removed input, options, handleSubmit, formRef, formHeight state and effects

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="relative h-screen flex flex-col"> {/* Changed to flex-col */}
//       <div
//         className="flex-grow w-full  max-w-3xl mx-auto overflow-y-auto px-4 md:px-0" // Added flex-grow
//         style={{
//           paddingBottom: '220px', // Adjusted padding for ChatInputBar
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none'
//         }}
//       >
//         <div className="space-y-4 py-4 bg-red">
//           {messages.map((message, index) => (
//             <MessageBubble
//               key={index}
//               message={message}
//             />
//           ))}
//           {isLoading && <LoadingIndicator />}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Removed old form, replaced with ChatInputBar */}
//       <ChatInputBar onSendMessage={onSendMessage} isLoading={isLoading} />

//       <style>{`
//         ::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   );
// }