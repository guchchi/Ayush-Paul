import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Heart } from 'lucide-react';
import { GitGlowLogo } from './GitGlowLogo';

interface GitGlowFooterProps {
  onScan: (username: string) => void;
  isScanning: boolean;
}

export const GitGlowFooter: React.FC<GitGlowFooterProps> = ({ onScan, isScanning }) => {
  const [footerUsername, setFooterUsername] = useState('');

  const handleBottomScan = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = footerUsername.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?github\.com\//i, '');
    if (cleaned) onScan(cleaned);
  };

  return (
    <footer className="bg-[#0D1117] text-[#E6EDF3] border-t border-[#30363D] pt-16 pb-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Bottom Final CTA (Second Scan Input) */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#161B22] to-[#0D1117] border border-[#30363D] text-center max-w-3xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D7FF36]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#E6EDF3]">
              Ready to Upgrade Your GitHub Profile?
            </h3>
            <p className="text-xs sm:text-sm text-[#8B949E] max-w-lg mx-auto">
              Scan your profile in 3 seconds. Uncover missing achievements and unlock your first badge in minutes.
            </p>
          </div>

          <form onSubmit={handleBottomScan} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={footerUsername}
                onChange={(e) => setFooterUsername(e.target.value)}
                placeholder="github.com/your-username"
                className="w-full pl-4 pr-4 py-3 bg-[#0D1117] border border-[#30363D] focus:border-[#D7FF36] rounded-xl text-sm text-[#E6EDF3] placeholder-[#8B949E] outline-none transition-colors"
                autoCapitalize="none"
                spellCheck="false"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="w-full sm:w-auto px-6 py-3 bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>Scan Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-[11px] text-[#8B949E] flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D7FF36]" />
            <span>100% Free · No password needed · Official verified git events</span>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-4">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Link to="/blueprints/gitglow" className="inline-block" title="GitGlow Platform">
              <GitGlowLogo size={32} showWordmark theme="dark" animated />
            </Link>
            <p className="text-xs text-[#8B949E] leading-relaxed max-w-sm">
              The guided platform helping developers and students claim official GitHub achievements legally, step-by-step, with automated sandbox engineering.
            </p>
          </div>

          {/* Column 1: Badges */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3] font-heading">
              Achievements
            </h4>
            <ul className="space-y-2 text-xs text-[#8B949E]">
              <li><Link to="/blueprints/gitglow/badges/pull-shark" className="hover:text-[#D7FF36] transition-colors">Pull Shark (🦈)</Link></li>
              <li><Link to="/blueprints/gitglow/badges/quickdraw" className="hover:text-[#D7FF36] transition-colors">Quickdraw (⚡)</Link></li>
              <li><Link to="/blueprints/gitglow/badges/yolo" className="hover:text-[#D7FF36] transition-colors">YOLO (🚀)</Link></li>
              <li><Link to="/blueprints/gitglow/badges/pair-extraordinaire" className="hover:text-[#D7FF36] transition-colors">Pair Extraordinaire (👥)</Link></li>
              <li><Link to="/blueprints/gitglow/badges/galaxy-brain" className="hover:text-[#D7FF36] transition-colors">Galaxy Brain (🧠)</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3] font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#8B949E]">
              <li><Link to="/blueprints/gitglow/how-it-works" className="hover:text-[#D7FF36] transition-colors">How It Works</Link></li>
              <li><Link to="/blueprints/gitglow/engine" className="hover:text-[#D7FF36] transition-colors">Interactive Engine</Link></li>
              <li><a href="#trust" className="hover:text-[#D7FF36] transition-colors">Trust & Safety Matrix</a></li>
              <li><a href="#faq" className="hover:text-[#D7FF36] transition-colors">Common FAQs</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Author */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3] font-heading">
              Creator & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#8B949E]">
              <li><Link to="/blueprints" className="hover:text-[#D7FF36] transition-colors">All Blueprints</Link></li>
              <li><a href="https://github.com/guchchi" target="_blank" rel="noopener noreferrer" className="hover:text-[#D7FF36] transition-colors">Ayush Paul on GitHub</a></li>
              <li><Link to="/privacy" className="hover:text-[#D7FF36] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#D7FF36] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-8 border-t border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B949E]">
          <p>© 2026 GitGlow. An independent open-source blueprint project by Ayush Paul.</p>
          <p className="text-[11px] text-[#8B949E]">
            GitHub and the GitHub logo are registered trademarks of GitHub, Inc. GitGlow is not affiliated with GitHub, Inc.
          </p>
        </div>

      </div>
    </footer>
  );
};
