import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem('cookie-consent', choice);
    setIsVisible(false);
    
    // Custom event to notify other parts of the app if needed (optional/safe)
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: choice }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-8 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="glass-card bg-[#0F0F0F]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6 md:gap-12 relative overflow-hidden group">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px] group-hover:bg-brand-primary/20 transition-all duration-700" />
              
              <div className="flex items-center gap-6 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                  <Cookie size={28} />
                </div>
                <div className="hidden md:block">
                  <h4 className="text-white font-bold tracking-tight">Cookie Transparency</h4>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Privacy Framework</p>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-center md:text-left">
                <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  We use cookies to enhance your experience, serve personalized ads via <span className="text-brand-primary">Google AdSense</span>, and analyze traffic. By clicking "Accept", you consent to our use of these digital tools.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Link to="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-brand-primary transition-colors flex items-center gap-1.5">
                    <ShieldCheck size={12} /> Privacy Policy
                  </Link>
                  <Link to="/cookie-policy" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-brand-primary transition-colors flex items-center gap-1.5">
                    <Cookie size={12} /> Cookie Policy
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                <button
                  onClick={() => handleChoice('rejected')}
                  className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 font-bold text-sm transition-all"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleChoice('accepted')}
                  className="flex-1 md:flex-none px-10 py-4 bg-white text-black rounded-2xl font-extrabold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                  Accept All
                </button>
              </div>

              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
