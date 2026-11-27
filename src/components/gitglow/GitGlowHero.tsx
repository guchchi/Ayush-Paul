import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Zap, Search, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { GitGlowLogo } from './GitGlowLogo';

interface GitGlowHeroProps {
  onScan: (username: string) => void;
  isScanning: boolean;
  initialUsername?: string;
}

export const GitGlowHero: React.FC<GitGlowHeroProps> = ({
  onScan,
  isScanning,
  initialUsername = '',
}) => {
  const [usernameInput, setUsernameInput] = useState(initialUsername);
  const [errorMsg, setErrorMsg] = useState('');

  const cleanUsername = (raw: string): string => {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^https?:\/\/(www\.)?github\.com\//i, '');
    cleaned = cleaned.replace(/^@/, '');
    cleaned = cleaned.split('/')[0].split('?')[0];
    return cleaned;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanUsername(usernameInput);
    if (!cleaned) {
      setErrorMsg('Please enter a valid GitHub username.');
      return;
    }
    setErrorMsg('');
    onScan(cleaned);
  };

  const handleQuickTry = (handle: string) => {
    setUsernameInput(handle);
    setErrorMsg('');
    onScan(handle);
  };

  return (
    <section className="relative pt-20 pb-10 sm:pt-24 sm:pb-12 md:pt-24 md:pb-12 overflow-hidden bg-[#0D1117] text-[#E6EDF3]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#D7FF36]/10 via-[#388BFD]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Core Headline & Upper-Middle Scan Box */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-4.5 text-left">
            {/* Student & Dev Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs font-medium text-[#D7FF36]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built for CS Students & Modern Developers</span>
            </div>

            {/* Headline with Space Grotesk */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-bold font-heading tracking-tight text-[#E6EDF3] leading-[1.08]">
              Grow Your GitHub Profile Credibility. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF36] via-[#B8F320] to-[#E6EDF3]">
                Unlock Official Badges.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#8B949E] leading-relaxed max-w-xl">
              90% of developers have an empty achievements tab. Scan your profile in 3 seconds, see exactly which badges you qualify for, and claim them with 1-click legal automation.
            </p>

            {/* Upper-Middle Scan Box (Keyboard Safe on Mobile, Font >= 16px) */}
            <div className="pt-1">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B949E]">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="github.com/your-username"
                    className="w-full pl-10 pr-4 py-3 bg-[#161B22] border border-[#30363D] focus:border-[#D7FF36] focus:ring-1 focus:ring-[#D7FF36] text-[#E6EDF3] placeholder-[#8B949E] rounded-xl text-base transition-all duration-200 outline-none"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScanning}
                  className="px-6 py-3 bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 shrink-0 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(215,255,54,0.25)]"
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <span>Audit Profile Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Error Message */}
              {errorMsg && (
                <p className="mt-2 text-xs text-rose-400 font-medium">{errorMsg}</p>
              )}

              {/* Quick Try Chips */}
              <div className="mt-2.5 flex items-center gap-2 text-xs text-[#8B949E]">
                <span>Quick try:</span>
                <button
                  type="button"
                  onClick={() => handleQuickTry('octocat')}
                  className="px-2 py-0.5 rounded-md bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#E6EDF3] transition-colors cursor-pointer"
                >
                  @octocat
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTry('guchchi')}
                  className="px-2 py-0.5 rounded-md bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#E6EDF3] transition-colors cursor-pointer"
                >
                  @guchchi
                </button>
              </div>
            </div>

            {/* Anti-BS Trust Pills */}
            <div className="pt-1 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#8B949E]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D7FF36]" />
                <span>Real GitHub git activity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#D7FF36]" />
                <span>No password required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#D7FF36]" />
                <span>1-Click sandbox merge</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Showcase Card / Mini Cabinet Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-5 rounded-2xl bg-[#161B22]/90 border border-[#30363D] shadow-2xl backdrop-blur-sm group hover:border-[#D7FF36]/40 transition-all duration-300">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#30363D]">
                <div className="flex items-center gap-2.5">
                  <GitGlowLogo size={28} showWordmark={false} />
                  <div>
                    <div className="text-xs font-bold text-[#E6EDF3] font-heading">GitGlow Live Showcase</div>
                    <div className="text-[11px] text-[#8B949E]">Official Achievement Simulator</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D7FF36]/10 border border-[#D7FF36]/20 text-[10px] font-bold text-[#D7FF36]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF36] animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Sample Profile HUD */}
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#8B949E]">Preview Score</div>
                  <div className="text-xl font-bold font-heading text-[#D7FF36] tabular-nums">
                    85 <span className="text-xs text-[#8B949E]">/ 100</span>
                  </div>
                </div>

                {/* Mini Shelf Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col items-center text-center">
                    <picture>
                      <source type="image/webp" srcSet="/images/badges/pull-shark.webp" />
                      <img
                        src="/images/badges/pull-shark.png"
                        alt="GitHub Pull Shark Achievement Badge"
                        width={36}
                        height={36}
                        loading="eager"
                        decoding="async"
                        className="w-9 h-9 object-contain mb-1.5 drop-shadow-sm"
                      />
                    </picture>
                    <span className="text-[11px] font-bold text-[#E6EDF3]">Pull Shark</span>
                    <span className="text-[9px] text-[#D7FF36] mt-0.5">Earned ✓</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col items-center text-center">
                    <picture>
                      <source type="image/webp" srcSet="/images/badges/quickdraw.webp" />
                      <img
                        src="/images/badges/quickdraw.png"
                        alt="GitHub Quickdraw Achievement Badge"
                        width={36}
                        height={36}
                        loading="eager"
                        decoding="async"
                        className="w-9 h-9 object-contain mb-1.5 drop-shadow-sm"
                      />
                    </picture>
                    <span className="text-[11px] font-bold text-[#E6EDF3]">Quickdraw</span>
                    <span className="text-[9px] text-[#D7FF36] mt-0.5">Earned ✓</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col items-center text-center">
                    <picture>
                      <source type="image/webp" srcSet="/images/badges/yolo.webp" />
                      <img
                        src="/images/badges/yolo.png"
                        alt="GitHub YOLO Achievement Badge"
                        width={36}
                        height={36}
                        loading="eager"
                        decoding="async"
                        className="w-9 h-9 object-contain mb-1.5 drop-shadow-sm"
                      />
                    </picture>
                    <span className="text-[11px] font-bold text-[#E6EDF3]">YOLO</span>
                    <span className="text-[9px] text-[#388BFD] mt-0.5">Pending ⏱</span>
                  </div>
                </div>

                {/* Simulated Terminal Step */}
                <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] font-code text-xs text-[#8B949E] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#E6EDF3]">
                    <span className="text-[#D7FF36]">$</span>
                    <span>gh pr merge --auto --merge</span>
                  </div>
                  <div className="text-[11px] text-emerald-400">✓ Merged into main with verified co-author RFC</div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-[#30363D] flex items-center justify-between text-[11px] text-[#8B949E]">
                <span>5 Verified Automated Tracks</span>
                <span className="text-[#E6EDF3] font-medium">Ready in ~2 min</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
