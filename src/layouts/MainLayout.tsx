import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';
import { SmoothScrollProvider } from '../components/ui/motion/SmoothScroll';

interface MainLayoutProps {
  children: React.ReactNode;
  onPortfolioClick: () => void;
}

export const MainLayout = ({ children, onPortfolioClick }: MainLayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor || !anchor.href || e.defaultPrevented) return;

      // Handle External Links
      if (anchor.origin !== window.location.origin || anchor.target === '_blank') {
        return; // Let browser handle it
      }

      // Handle Internal Links (SPA Navigation)
      e.preventDefault();
      const path = anchor.pathname + anchor.search + anchor.hash;
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <SmoothScrollProvider>
      <CommandPalette />
      <Navbar onPortfolioClick={onPortfolioClick} />
      
      <main className="w-full relative z-[10]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </SmoothScrollProvider>
  );
};
