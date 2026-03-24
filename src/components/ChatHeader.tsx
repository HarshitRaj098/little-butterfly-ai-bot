import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function ChatHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-butterfly-primary/10 bg-butterfly-bg/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-10 h-10 rounded-full bg-butterfly-primary/10 flex items-center justify-center border border-butterfly-primary/20"
        >
          <Sparkles className="w-6 h-6 text-butterfly-primary" />
        </motion.div>
        <div>
          <h1 className="font-display text-xl font-bold text-white tracking-tight">butterfly ai</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-butterfly-accent animate-pulse" />
            <span className="text-[10px] text-butterfly-primary/60 font-bold uppercase tracking-widest">fluttering...</span>
          </div>
        </div>
      </div>
    </header>
  );
}
