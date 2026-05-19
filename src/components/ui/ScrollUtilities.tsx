import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const targetId = hash.startsWith('#') ? hash.substring(1) : hash;
      
      const handleHashScroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      // Try immediately in case it's already mounted
      handleHashScroll();

      // Delay to handle client-side rendering and mount times
      const timer = setTimeout(handleHashScroll, 100);
      const timerLong = setTimeout(handleHashScroll, 400);

      return () => {
        clearTimeout(timer);
        clearTimeout(timerLong);
      };
    }
  }, [pathname, hash]);

  return null;
};

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+96px)] right-6 sm:bottom-12 sm:right-12 z-[9999] w-14 h-14 rounded-full bg-brand-primary text-white shadow-[0_0_30px_rgba(0,194,255,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          <ChevronUp size={28} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
