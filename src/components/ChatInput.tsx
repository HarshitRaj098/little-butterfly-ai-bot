import { Send } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto flex items-end gap-3 p-4 bg-butterfly-surface/90 backdrop-blur-md border border-butterfly-primary/10 rounded-[2rem] shadow-2xl"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="say something sweet (or not)..."
        disabled={isLoading}
        className="flex-1 max-h-32 p-3 bg-transparent border-none focus:ring-0 text-sm text-gray-200 placeholder:text-gray-600 font-display font-medium resize-none outline-none"
      />
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(124, 108, 246, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading || !input.trim()}
        className={`p-3 rounded-2xl transition-all duration-200 ${
          input.trim() && !isLoading
            ? 'bg-butterfly-primary text-white shadow-lg shadow-butterfly-primary/20'
            : 'bg-butterfly-primary/5 text-butterfly-primary/20 cursor-not-allowed'
        }`}
      >
        <Send className="w-5 h-5" />
      </motion.button>
    </form>
  );
}
