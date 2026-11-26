import React from 'react';
import { GitGlowNavbar } from '../../../components/gitglow/GitGlowNavbar';
import { GitGlowHero } from '../../../components/gitglow/GitGlowHero';

export const GitGlowHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--action)] selection:text-[var(--on-action)] font-sans overflow-x-hidden">
      {/* 0. Navbar: Badges, How it works, Connect GitHub (not sticky on mobile - DESIGN.md §6.0, §9) */}
      <GitGlowNavbar />

      {/* 1. Hero: Headline, Subtitle, Scan box, Example usernames, Trust pills, Static Medallion (DESIGN.md §6.1) */}
      <main>
        <GitGlowHero />
      </main>
    </div>
  );
};

export default GitGlowHomePage;
