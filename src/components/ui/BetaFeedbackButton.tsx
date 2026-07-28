import { motion, AnimatePresence } from 'motion/react';
import { MessageSquarePlus } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BetaFeedbackButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Show after a small delay to not interrupt initial render animations
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.a
        href="https://tally.so/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-full bg-brand-primary text-white shadow-[0_0_20px_rgba(0,194,255,0.3)] border border-brand-primary/50 cursor-pointer group hover:bg-brand-primary/90 transition-colors"
      >
        <MessageSquarePlus size={18} className="text-white" />
        
        <motion.span 
          initial={{ width: 0, opacity: 0, marginLeft: 0 }}
          animate={{ 
            width: isHovered ? 'auto' : 0, 
            opacity: isHovered ? 1 : 0,
            marginLeft: isHovered ? 4 : 0
          }}
          className="text-sm font-semibold whitespace-nowrap overflow-hidden"
        >
          Give Beta Feedback
        </motion.span>

        {/* Pulsing indicator for beta visibility */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </motion.a>
    </AnimatePresence>
  );
}
