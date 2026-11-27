import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Terminal, 
  ArrowRight,
  ExternalLink,
  GitBranch,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const GitGlowTrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-16 md:py-24 bg-[#0D1117] text-[#E6EDF3]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs font-bold text-[#D7FF36] uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Trust & Security Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading tracking-tight text-[#E6EDF3]">
            How It Works — Transparent, Safe, & Legal
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8B949E]">
            GitGlow never asks for your password or alters existing code. Every achievement is earned by executing genuine git workflows inside your own sandbox repository.
          </p>
        </div>

        {/* 3 Step Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center font-bold text-[#D7FF36] font-heading">
              1
            </div>
            <h3 className="text-lg font-bold text-[#E6EDF3] font-heading">Scan Public Profile</h3>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Enter any GitHub handle. GitGlow queries GitHub’s public GraphQL and REST APIs to audit which achievement criteria are already satisfied.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center font-bold text-[#D7FF36] font-heading">
              2
            </div>
            <h3 className="text-lg font-bold text-[#E6EDF3] font-heading">Execute 1-Click Sandbox</h3>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              When you click Claim, the agent creates an isolated <code className="text-[#D7FF36]">gitglow-sandbox</code> repo in your account and stages verified git events.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center font-bold text-[#D7FF36] font-heading">
              3
            </div>
            <h3 className="text-lg font-bold text-[#E6EDF3] font-heading">GitHub Verifies & Awards</h3>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              GitHub’s backend parses the merged PR or closed issue. The official achievement badge appears on your profile within hours to days.
            </p>
          </div>
        </div>

        {/* 2-Column Matrix + Live Terminal Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Two-Column Matrix (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* What the Bot Does */}
            <div className="p-6 rounded-2xl bg-[#161B22] border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-heading">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>What The Bot Does</span>
              </div>
              <ul className="space-y-3 text-xs text-[#8B949E]">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Creates an isolated public test repository (<code className="text-[#E6EDF3]">gitglow-sandbox</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Stages valid RFC git commit trailers and pull requests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Merges feature branches into the default branch automatically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Can be audited or deleted by you at any time.</span>
                </li>
              </ul>
            </div>

            {/* What the Bot NEVER Does */}
            <div className="p-6 rounded-2xl bg-[#161B22] border border-rose-500/30 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-heading">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>What It Never Does</span>
              </div>
              <ul className="space-y-3 text-xs text-[#8B949E]">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✗</span>
                  <span>Never touches your existing repositories, stars, or orgs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✗</span>
                  <span>Never asks for your password or private personal tokens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✗</span>
                  <span>Never generates fake commits, fake streaks, or bot stars.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✗</span>
                  <span>Never prevents you from revoking OAuth access in 1 click.</span>
                </li>
              </ul>
            </div>

            {/* Revoke Permission link */}
            <div className="sm:col-span-2 pt-2 flex flex-wrap items-center justify-between text-xs text-[#8B949E]">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D7FF36]" />
                <span>Permissions limited strictly to sandbox repository management.</span>
              </div>
              <a
                href="https://github.com/settings/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D7FF36] hover:underline flex items-center gap-1 font-medium mt-1 sm:mt-0"
              >
                <span>Revoke OAuth anytime in GitHub Settings</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Column: 15-Second Terminal Visualizer (5 Cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#161B22] border border-[#30363D] font-code space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D] text-xs text-[#8B949E]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-medium text-[#E6EDF3]">sandbox-runner.sh</span>
              </div>
              <span className="text-[10px] text-[#D7FF36] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF36] animate-pulse" />
                LIVE LOOP
              </span>
            </div>

            <div className="text-xs space-y-2 py-1 text-[#8B949E] leading-relaxed">
              <div className="text-[#E6EDF3]">
                <span className="text-[#D7FF36]">$</span> git checkout -b feat/pull-shark-audit
              </div>
              <div className="text-[#8B949E]">
                Switched to a new branch 'feat/pull-shark-audit'
              </div>
              <div className="text-[#E6EDF3]">
                <span className="text-[#D7FF36]">$</span> git commit --allow-empty -m "feat: verified co-author RFC"
              </div>
              <div className="text-emerald-400 text-[11px]">
                [feat/pull-shark-audit 8a2f1c9] Co-authored-by: GitGlow Agent
              </div>
              <div className="text-[#E6EDF3]">
                <span className="text-[#D7FF36]">$</span> gh pr merge --auto --merge
              </div>
              <div className="p-2 rounded bg-[#0D1117] border border-emerald-500/30 text-emerald-300 text-[11px]">
                ✓ PR #1 merged into main. Event queued for GitHub Achievement verification.
              </div>
            </div>

            <div className="pt-2 border-t border-[#30363D] flex items-center justify-between text-[11px] text-[#8B949E]">
              <span>Duration: ~15 seconds</span>
              <Link to="/blueprints/gitglow/how-it-works" className="text-[#D7FF36] hover:underline flex items-center gap-1">
                <span>Full Security Deep Dive →</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
