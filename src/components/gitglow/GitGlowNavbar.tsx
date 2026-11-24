import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitGlowLogo } from './GitGlowLogo';
import { Github, Menu, X, ArrowRight, User } from 'lucide-react';

interface GitGlowNavbarProps {
  connectedUser: { username: string; avatarUrl?: string } | null;
  onConnectGitHub: () => void;
}

export const GitGlowNavbar: React.FC<GitGlowNavbarProps> = ({
  connectedUser,
  onConnectGitHub,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#0D1117] border-b border-[#30363D] relative z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/blueprints/gitglow" className="flex items-center gap-2">
          <GitGlowLogo size={28} showWordmark theme="dark" animated />
        </Link>

        {/* Desktop Nav Links (Max 4 items) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#8B949E]">
          <a href="#cabinet" className="hover:text-[#E6EDF3] transition-colors">
            Trophies
          </a>
          <a href="#trust" className="hover:text-[#E6EDF3] transition-colors">
            How It Works
          </a>
          <a href="#faq" className="hover:text-[#E6EDF3] transition-colors">
            FAQ
          </a>
          <Link to="/blueprints/gitglow/engine" className="hover:text-[#D7FF36] transition-colors flex items-center gap-1">
            <span>CLI Engine</span>
          </Link>
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center gap-3">
          {connectedUser ? (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#161B22] border border-[#30363D] text-xs text-[#E6EDF3]">
              {connectedUser.avatarUrl ? (
                <img src={connectedUser.avatarUrl} alt={connectedUser.username} className="w-5 h-5 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-[#D7FF36]" />
              )}
              <span className="font-bold">@{connectedUser.username}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onConnectGitHub}
              className="px-4 py-2 rounded-xl bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#D7FF36]/40 text-[#E6EDF3] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Github className="w-4 h-4 text-[#D7FF36]" />
              <span>Connect GitHub</span>
            </button>
          )}

          <a
            href="#cabinet"
            className="px-4 py-2 rounded-xl bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Audit Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="#cabinet"
            className="px-3 py-1.5 rounded-lg bg-[#D7FF36] text-[#0D1117] font-bold text-xs"
          >
            Scan
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-[#161B22] border-b border-[#30363D] space-y-3 text-sm text-[#8B949E]">
          <a
            href="#cabinet"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#E6EDF3] font-medium"
          >
            Trophies Cabinet
          </a>
          <a
            href="#trust"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#E6EDF3] font-medium"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#E6EDF3] font-medium"
          >
            FAQ
          </a>
          <Link
            to="/blueprints/gitglow/engine"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#D7FF36] font-medium"
          >
            Interactive CLI Engine →
          </Link>
          <div className="pt-2 border-t border-[#30363D]">
            {connectedUser ? (
              <div className="text-xs text-[#E6EDF3] py-2">
                Signed in as <span className="font-bold text-[#D7FF36]">@{connectedUser.username}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onConnectGitHub();
                }}
                className="w-full py-2.5 rounded-xl bg-[#21262D] text-[#E6EDF3] font-bold text-xs flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4 text-[#D7FF36]" />
                <span>Connect GitHub</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
