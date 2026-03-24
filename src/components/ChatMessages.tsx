import { Message } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 pb-32 space-y-6 bg-butterfly-bg"
    >
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <motion.div
              whileHover={{ scale: 1.01, boxShadow: message.role === 'user' ? "0 0 20px rgba(124, 108, 246, 0.2)" : "0 0 20px rgba(255, 79, 216, 0.1)" }}
              className={`max-w-[85%] px-5 py-3 rounded-[2rem] shadow-lg transition-all duration-300 ${
                message.role === 'user'
                  ? 'bg-butterfly-primary text-white rounded-br-none'
                  : 'bg-butterfly-surface text-gray-200 rounded-bl-none border border-butterfly-primary/10'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <span className={`text-[9px] mt-1.5 block font-bold uppercase tracking-widest opacity-40 ${
                message.role === 'user' ? 'text-white' : 'text-butterfly-primary'
              }`}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="bg-butterfly-surface px-5 py-3 rounded-[2rem] rounded-bl-none border border-butterfly-primary/10 flex gap-1.5 items-center shadow-lg">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              className="w-1.5 h-1.5 rounded-full bg-butterfly-primary"
            />
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-butterfly-accent"
            />
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
              className="w-1.5 h-1.5 rounded-full bg-butterfly-highlight"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
