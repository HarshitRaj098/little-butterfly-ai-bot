/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { Message } from './types';
import { sendMessage } from './services/aiService';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Settings2, Sparkles, Brain, Zap } from 'lucide-react';
import { getLearningData, updatePersonality, Personality } from './services/learningService';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "I see you're back... ready to look for patterns in the noise? 🦋",
      createdAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [personality, setPersonality] = useState<Personality>(getLearningData().personality);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const showToast = useCallback((message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handlePersonalityChange = (key: keyof Personality, value: number) => {
    const newPersonality = { ...personality, [key]: value };
    setPersonality(newPersonality);
    updatePersonality(newPersonality);
  };

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
        {/* Personality Settings Toggle */}
        <div className="absolute top-4 right-6 z-20">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-full transition-all duration-300 ${
              isSettingsOpen 
                ? 'bg-butterfly-primary text-white shadow-[0_0_15px_rgba(124,108,246,0.5)]' 
                : 'bg-butterfly-surface/50 text-butterfly-primary border border-butterfly-primary/20 hover:bg-butterfly-surface'
            }`}
          >
            <Settings2 size={18} />
          </button>
        </div>

        {/* Personality Settings Panel */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="absolute top-16 right-6 z-20 w-64 p-5 rounded-3xl bg-butterfly-surface/90 border border-butterfly-primary/20 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-butterfly-primary">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Aura Settings</span>
                </div>

                {/* Poetic Level */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    <span>Poetic</span>
                    <span>{(personality.poeticLevel * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01"
                    value={personality.poeticLevel}
                    onChange={(e) => handlePersonalityChange('poeticLevel', parseFloat(e.target.value))}
                    className="w-full h-1 bg-butterfly-bg rounded-lg appearance-none cursor-pointer accent-butterfly-primary"
                  />
                </div>

                {/* Technical Depth */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    <span>Technical</span>
                    <span>{(personality.technicalDepth * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01"
                    value={personality.technicalDepth}
                    onChange={(e) => handlePersonalityChange('technicalDepth', parseFloat(e.target.value))}
                    className="w-full h-1 bg-butterfly-bg rounded-lg appearance-none cursor-pointer accent-butterfly-primary"
                  />
                </div>

                {/* Sass Level */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    <span>Sass</span>
                    <span>{(personality.sassLevel * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01"
                    value={personality.sassLevel}
                    onChange={(e) => handlePersonalityChange('sassLevel', parseFloat(e.target.value))}
                    className="w-full h-1 bg-butterfly-bg rounded-lg appearance-none cursor-pointer accent-butterfly-primary"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-butterfly-primary/10 flex items-center justify-between text-[9px] text-gray-500 italic">
                <div className="flex items-center gap-2">
                  <Sparkles size={10} />
                  <span>Calibrating presence...</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-butterfly-accent animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
