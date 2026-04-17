import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';
import { MobileBottomNav } from './MobileBottomNav';

import { SmoothScrollProvider } from '../components/ui/motion/SmoothScroll';

interface MainLayoutProps {
  children: React.ReactNode;
  onPortfolioClick: () => void;
}

export const MainLayout = ({ children, onPortfolioClick }: MainLayoutProps) => {
  return (
    <SmoothScrollProvider>
      <CommandPalette />
      <Navbar onPortfolioClick={onPortfolioClick} />
      
      <main className="max-w-[100vw] overflow-x-hidden">
        {children}
      </main>
      
      <Footer />
      <MobileBottomNav onPortfolioClick={onPortfolioClick} />
    </SmoothScrollProvider>
  );
};
