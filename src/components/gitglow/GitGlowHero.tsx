import React, { useState } from 'react';
import { ShieldCheck, GitCommit, Zap, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface MockScanResult {
  username: string;
  score: number;
  unlockedBadges: string[];
  claimableBadges: string[];
}

export const GitGlowHero: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MockScanResult | null>(null);

  const cleanUsername = (raw: string): string => {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^https?:\/\/(www\.)?github\.com\//i, '');
    cleaned = cleaned.replace(/^@/, '');
    cleaned = cleaned.split('/')[0].split('?')[0];
    return cleaned;
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanUsername(usernameInput);
    if (!cleaned) {
      setErrorMsg('Check the username spelling');
      return;
    }

    setErrorMsg('');
    setIsScanning(true);
    setScanResult(null);

    // Mock scan simulation: shows skeleton shimmer, then delivers fake result message (no real GitHub calls yet)
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        username: cleaned,
        score: 84,
        unlockedBadges: ['Pull Shark', 'Quickdraw'],
        claimableBadges: ['YOLO', 'Pair Extraordinaire', 'Galaxy Brain'],
      });
    }, 1600);
  };

  const handleSelectExample = (handle: string) => {
    setUsernameInput(handle);
    setErrorMsg('');
    setScanResult(null);
  };

  const handleResetScan = () => {
    setScanResult(null);
    setUsernameInput('');
    setErrorMsg('');
  };

  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* Background Soft Glow Ambient (Glow means progress - DESIGN.md §2.2) */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(198,255,61,0.08),rgba(77,163,255,0.04),transparent_70%)] pointer-events-none blur-3xl -z-10" 
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy + Scan Box + Trust Pills */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Student Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--action)]">
              <span>GitHub Achievement Accelerator</span>
            </div>

            {/* Headline (Space Grotesk 700 with full stop - DESIGN.md §4, §6) */}
            <h1 className="type-hero-headline text-[var(--text)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-[1.1]">
              Make Your GitHub Profile Stand Out in Minutes.
            </h1>

            {/* Subtitle (Inter 400/500 - DESIGN.md §4, §6) */}
            <p className="type-body text-[var(--text-muted)] text-base sm:text-lg leading-relaxed max-w-xl">
              See missing achievements. Claim in 1 click.
            </p>

            {/* Scan Box (Same component as /styleguide, with stacking < 480px - DESIGN.md §7.1, §9) */}
            <div className="pt-1">
              <div className="scan-input-card p-4 sm:p-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-3 max-w-xl">
                <form onSubmit={handleScanSubmit}>
                  <div className="space-y-2">
                    <div className="scan-input-group flex flex-col xl:flex-row items-stretch gap-2.5">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => {
                          setUsernameInput(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="github.com/username or @username"
                        disabled={isScanning}
                        className={`scan-input-field w-full xl:flex-1 min-w-0 py-3 px-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] text-[var(--text)] placeholder-[var(--text-muted)] text-base transition-colors focus-visible:outline-2 focus-visible:outline-[var(--action)] focus-visible:outline-offset-2 ${
                          errorMsg 
                            ? 'border-2 border-[var(--danger)]' 
                            : 'border border-[var(--border)]'
                        } ${isScanning ? 'opacity-60 cursor-not-allowed' : ''}`}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                      <button
                        type="submit"
                        disabled={isScanning}
                        className="scan-input-btn w-full xl:w-auto shrink-0 py-3 px-6 rounded-[var(--radius-control)] bg-[var(--action)] text-[var(--on-action)] font-bold text-sm shadow-[var(--glow-action)] hover:brightness-105 active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isScanning ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-[var(--on-action)] border-t-transparent rounded-full animate-spin" />
                            <span>Auditing...</span>
                          </div>
                        ) : (
                          <span>Audit Free</span>
                        )}
                      </button>
                    </div>

                    {/* Inline Error Helper */}
                    {errorMsg && (
                      <div className="flex items-center gap-1.5 text-xs text-[var(--danger)] font-medium pt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}
                  </div>
                </form>

                {/* Example Usernames (DESIGN.md §6) */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--text-muted)]">
                  <span>Try examples:</span>
                  <button
                    type="button"
                    onClick={() => handleSelectExample('@octocat')}
                    className="px-2.5 py-1 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--action)] transition-colors font-mono cursor-pointer"
                  >
                    @octocat
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectExample('@your-own')}
                    className="px-2.5 py-1 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--action)] transition-colors font-mono cursor-pointer"
                  >
                    @your-own
                  </button>
                </div>
              </div>
            </div>

            {/* Mock Loading Skeleton (Shimmer, not a spinner - DESIGN.md §8) */}
            {isScanning && (
              <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border)] space-y-3 max-w-xl animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-[var(--surface-2)] rounded" />
                  <div className="h-4 w-16 bg-[var(--surface-2)] rounded" />
                </div>
                <div className="h-2.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--action)] rounded-full w-3/5 animate-pulse" />
                </div>
                <p className="text-xs font-mono text-[var(--action)]">
                  Analyzing public GitHub repositories & achievements...
                </p>
              </div>
            )}

            {/* Mock Fake Result Message (DESIGN.md §7.2, §7.3) */}
            {scanResult && !isScanning && (
              <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[rgba(245,196,81,0.3)] space-y-3 max-w-xl shadow-[var(--glow-earned)]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="text-xs font-mono text-[var(--earned)] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Audit complete for @{scanResult.username}</span>
                  </span>
                  <span className="text-xs font-mono text-[var(--action)] font-bold tabular-nums">
                    Score: {scanResult.score} / 100
                  </span>
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  Found <strong>2 earned badges</strong> on profile. <strong>3 achievements</strong> ready to claim with 1-click bot.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {scanResult.unlockedBadges.map((badge) => (
                    <span 
                      key={badge} 
                      className="type-label px-2.5 py-1 rounded-full bg-[rgba(245,196,81,0.12)] text-[var(--earned)] border border-[rgba(245,196,81,0.35)] text-xs inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{badge} ✓</span>
                    </span>
                  ))}
                  {scanResult.claimableBadges.map((badge) => (
                    <span 
                      key={badge} 
                      className="type-label px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] text-xs"
                    >
                      {badge} (Available)
                    </span>
                  ))}
                </div>
                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleResetScan}
                    className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Scan another username</span>
                  </button>
                </div>
              </div>
            )}

            {/* Trust Pills: 3 Exact Pills (DESIGN.md §6 & §12) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="type-label px-3.5 py-1.5 rounded-full bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] inline-flex items-center gap-2 text-xs">
                <GitCommit className="w-4 h-4 text-[var(--action)] shrink-0" />
                <span className="text-[var(--text)]">Real GitHub activity</span>
              </div>
              <div className="type-label px-3.5 py-1.5 rounded-full bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] inline-flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-[var(--action)] shrink-0" />
                <span className="text-[var(--text)]">No password</span>
              </div>
              <div className="type-label px-3.5 py-1.5 rounded-full bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] inline-flex items-center gap-2 text-xs">
                <Zap className="w-4 h-4 text-[var(--action)] shrink-0" />
                <span className="text-[var(--text)]">1-click</span>
              </div>
            </div>

          </div>

          {/* Right Column: Static 3D Medallion Placeholder (DESIGN.md §6, §9 - No WebGL) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              
              {/* Outer Radiant Glow */}
              <div 
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(198,255,61,0.18),rgba(245,196,81,0.12),transparent_70%)] blur-2xl pointer-events-none" 
                aria-hidden="true" 
              />

              {/* Static Medallion Illustration (No WebGL) */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-[var(--border)] bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] p-3 shadow-2xl flex items-center justify-center group">
                {/* Metallic Inner Rim */}
                <div className="w-full h-full rounded-full border-2 border-[var(--border)] bg-gradient-to-tr from-[#161B22] via-[#1C2230] to-[#252D3D] flex flex-col items-center justify-center relative overflow-hidden">
                  
                  {/* Subtle Shimmer Accent */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-[var(--action)] opacity-10 blur-xl rounded-full" />
                  
                  {/* Achievement Emblem Vector */}
                  <svg 
                    width="88" 
                    height="88" 
                    viewBox="0 0 88 88" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_4px_16px_rgba(198,255,61,0.35)]"
                    aria-label="Achievement Medallion Mark"
                  >
                    {/* Octagonal Starburst Badge */}
                    <circle cx="44" cy="44" r="38" stroke="var(--action)" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
                    <circle cx="44" cy="44" r="32" fill="url(#medallion_grad)" stroke="var(--action)" strokeWidth="1.5" />
                    
                    {/* Trophy Star Emblem */}
                    <path 
                      d="M44 26L48.2 36.5L59.5 37.5L50.8 45.3L53.4 56.4L44 50.5L34.6 56.4L37.2 45.3L28.5 37.5L39.8 36.5L44 26Z" 
                      fill="var(--action)" 
                      stroke="#0D1117" 
                      strokeWidth="1.5"
                    />

                    <defs>
                      <linearGradient id="medallion_grad" x1="20" y1="20" x2="68" y2="68" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#1C2230" />
                        <stop offset="1" stopColor="#0D1117" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Medallion Label */}
                  <div className="mt-3 text-center">
                    <span className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--action)] block">
                      GitGlow
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-0.5">
                      Achievement Badge
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Static on Mobile Spec Label (DESIGN.md §6, §9) */}
            <div className="mt-3 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)]">
                3D Medallion (Static on Mobile)
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
