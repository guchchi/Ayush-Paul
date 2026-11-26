import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitGlowLogo } from './GitGlowLogo';
import { Github, Menu, X } from 'lucide-react';

interface GitGlowNavbarProps {
  connectedUser?: { username: string; avatarUrl?: string } | null;
  onConnectGitHub?: () => void;
}

export const GitGlowNavbar: React.FC<GitGlowNavbarProps> = ({ connectedUser, onConnectGitHub }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnect = () => {
    if (onConnectGitHub) {
      onConnectGitHub();
    } else {
      alert('Mock Connect: GitHub OAuth flow will connect here in Phase 5.');
    }
  };

  return (
    // Not sticky on mobile (DESIGN.md §6.0, §9)
    <header className="w-full bg-[var(--bg)] border-b border-[var(--border)] relative md:sticky md:top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="GitGlow Home">
          <GitGlowLogo size={28} showWordmark theme="dark" />
        </Link>

        {/* Desktop Nav Items (Max 4 items: Badges, How it works, Connect GitHub - DESIGN.md §6.0) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
          <a
            href="#badges"
            className="hover:text-[var(--text)] transition-colors duration-[var(--duration-fast)]"
          >
            Badges
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[var(--text)] transition-colors duration-[var(--duration-fast)]"
          >
            How it works
          </a>
        </nav>

        {/* Desktop Connect Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={handleConnect}
            className="px-4 py-2 rounded-[var(--radius-control)] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--action)] text-[var(--text)] hover:text-[var(--action)] font-medium text-sm flex items-center gap-2 transition-all duration-[var(--duration-fast)] cursor-pointer active:scale-[0.98]"
          >
            <Github className="w-4 h-4 text-[var(--action)]" />
            <span>Connect GitHub</span>
          </button>
        </div>

        {/* Mobile Action & Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={handleConnect}
            className="px-3 py-1.5 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-xs font-medium flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5 text-[var(--action)]" />
            <span>Connect</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu (Not sticky) */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)] space-y-2 text-sm">
          <a
            href="#badges"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-[var(--radius-control)] text-[var(--text)] hover:bg-[var(--surface-2)] font-medium transition-colors"
          >
            Badges
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-[var(--radius-control)] text-[var(--text)] hover:bg-[var(--surface-2)] font-medium transition-colors"
          >
            How it works
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleConnect();
            }}
            className="w-full py-2.5 px-3 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--action)] text-sm font-bold flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" />
            <span>Connect GitHub</span>
          </button>
        </div>
      )}
    </header>
  );
};
