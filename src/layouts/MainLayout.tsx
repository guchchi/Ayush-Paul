import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor || !anchor.href || e.defaultPrevented || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href);
      const isInternal = url.origin === window.location.origin;
      const isExternal = !isInternal || anchor.target === '_blank';

      if (isExternal) return;

      // Handle Internal SPA Navigation
      e.preventDefault();
      const path = anchor.pathname + anchor.search + anchor.hash;
      
      if (anchor.hash && anchor.pathname === location.pathname) {
        const id = anchor.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', path);
        }
      } else {
        navigate(path);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [navigate, location.pathname]);

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
