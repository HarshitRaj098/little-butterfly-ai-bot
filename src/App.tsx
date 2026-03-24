/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { Message } from './types';
import { sendMessage } from './services/aiService';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "well well… look who’s here 😏\n\nso what are we doing today — solving something big or breaking things again?\neither way, I’m in 🦋",
      createdAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const showToast = useCallback((message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSendMessage = async (input: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendMessage(input);
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      showToast('Oops! My wings got clipped. Try again?');
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-butterfly-bg font-sans selection:bg-butterfly-primary/30 selection:text-butterfly-highlight">
      <ChatHeader />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <ChatMessages messages={messages} isLoading={isLoading} />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-butterfly-bg via-butterfly-bg/90 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border ${
              toast.type === 'error' 
                ? 'bg-red-950/50 border-red-500/50 text-red-400' 
                : 'bg-butterfly-primary/10 border-butterfly-primary/50 text-butterfly-primary'
            }`}>
              {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
