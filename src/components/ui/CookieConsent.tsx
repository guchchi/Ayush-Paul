import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cookie, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem('cookie-consent', choice);
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: choice }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto pointer-events-auto">
            <div className="glass-card bg-[#0F0F0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full p-4 md:px-8 md:py-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 relative overflow-hidden">
              {/* Subtle accent glow */}
              <div className="absolute top-0 left-0 w-1/2 h-full bg-brand-primary/5 blur-3xl -translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-brand-primary/10 items-center justify-center text-brand-primary shrink-0">
                  <Cookie size={20} />
                </div>
                <p className="text-white/70 text-sm font-medium leading-tight max-w-md">
                  We use cookies to improve experience and show relevant ads. 
                  <a href="/privacy" className="text-brand-primary hover:underline ml-1">Learn more</a>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsVisible(false)} // Just a placeholder for preferences for now
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                  <Settings size={12} /> Preferences
                </button>
                <button
                  onClick={() => handleChoice('rejected')}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 font-bold text-[11px] uppercase tracking-widest transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleChoice('accepted')}
                  className="flex-1 md:flex-none px-8 py-2.5 bg-brand-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
