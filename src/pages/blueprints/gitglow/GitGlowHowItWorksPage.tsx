import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  GitBranch, 
  Terminal, 
  ExternalLink, 
  ChevronRight, 
  Zap,
  ArrowRight,
  Sparkles,
  Key
} from 'lucide-react';
import { GitGlowNavbar } from '../../../components/gitglow/GitGlowNavbar';
import { GitGlowFooter } from '../../../components/gitglow/GitGlowFooter';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow } from '../../../lib/gitglow/gitglow-auth';

export const GitGlowHowItWorksPage: React.FC = () => {
  const { connectedUser, setConnectedUser, isScanning, setTargetUsername, runScan } = useGitGlowStore();

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] selection:bg-[#D7FF36] selection:text-[#0D1117] font-sans">
      
      {/* Navbar */}
      <GitGlowNavbar
        connectedUser={connectedUser ? { username: connectedUser.githubUsername, avatarUrl: connectedUser.avatarUrl || undefined } : null}
        onConnectGitHub={async () => {
          try {
            const user = await connectGitHubForGitGlow();
            setConnectedUser(user);
          } catch (e: any) {
            alert(e.message);
          }
        }}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-[#30363D] bg-[#161B22]/50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-[#8B949E]">
          <Link to="/blueprints" className="hover:text-[#E6EDF3] transition-colors">Blueprints</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/blueprints/gitglow" className="hover:text-[#E6EDF3] transition-colors">GitGlow</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D7FF36] font-medium">How It Works</span>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs font-bold text-[#D7FF36] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-BS Security & Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#E6EDF3] tracking-tight leading-[1.15]">
            How GitGlow Works Under the Hood
          </h1>
          <p className="text-sm sm:text-base text-[#8B949E] leading-relaxed">
            Everything you need to know about what GitGlow does, what permissions we ask for, and why your GitHub account remains 100% secure.
          </p>
        </div>

        {/* Section 1: The Core Architecture */}
        <div className="p-8 rounded-3xl bg-[#161B22] border border-[#30363D] space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#E6EDF3] flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#D7FF36]" />
            <span>1. The 3-Step Execution Model</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#8B949E] leading-relaxed">
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <div className="font-bold text-[#E6EDF3] text-sm font-heading">Step 1: Public Read Audit</div>
              <p>We read public GitHub profile endpoints to calculate which achievements are already unlocked. Zero authentication required.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <div className="font-bold text-[#E6EDF3] text-sm font-heading">Step 2: Isolated Sandbox Actions</div>
              <p>When you click Claim, the agent creates an isolated <code className="text-[#D7FF36]">gitglow-sandbox</code> repo in your account and triggers genuine git events.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <div className="font-bold text-[#E6EDF3] text-sm font-heading">Step 3: GitHub Verification</div>
              <p>GitHub’s own achievement backend evaluates the public git commit/PR event and automatically awards the badge to your profile.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Two-Column Safety Matrix */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#E6EDF3]">
            2. The Strict Safety Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#161B22] border border-emerald-500/40 space-y-4">
              <div className="text-emerald-400 font-bold text-sm font-heading flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>What The Bot Does</span>
              </div>
              <ul className="space-y-3 text-xs text-[#8B949E] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Creates an isolated public test repository (<code className="text-[#E6EDF3]">gitglow-sandbox</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Stages standard RFC 5118 Git commit trailers (<code className="text-[#E6EDF3]">Co-authored-by</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Merges feature branches into the default branch via GitHub REST API.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Can be safely deleted by you at any time once badges appear.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#161B22] border border-rose-500/40 space-y-4">
              <div className="text-rose-400 font-bold text-sm font-heading flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>What It Never Does</span>
              </div>
              <ul className="space-y-3 text-xs text-[#8B949E] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✗</span>
                  <span>Never touches your existing personal repositories or organizations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✗</span>
                  <span>Never asks for passwords or private personal access tokens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✗</span>
                  <span>Never generates fake commits, fake green squares, or star swaps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✗</span>
                  <span>Never accesses private repositories or internal company code.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Exact OAuth Permissions */}
        <div className="p-8 rounded-3xl bg-[#161B22] border border-[#30363D] space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#E6EDF3] flex items-center gap-2">
            <Key className="w-5 h-5 text-[#388BFD]" />
            <span>3. Why Does GitGlow Need GitHub OAuth?</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
            GitHub does not allow third-party tools to create pull requests or close issues on your behalf without your explicit authorization. When you connect with GitHub, we request the standard <code className="text-[#D7FF36]">repo</code> scope.
          </p>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs text-[#8B949E] space-y-2">
            <div className="font-bold text-[#E6EDF3]">You have complete control:</div>
            <p>You can revoke GitGlow’s OAuth authorization in 1 click at any time through your official GitHub Settings:</p>
            <a
              href="https://github.com/settings/applications"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#D7FF36] font-bold hover:underline pt-1"
            >
              <span>GitHub Account Settings → Authorized OAuth Apps → Revoke</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Section 4: Manual Option */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#161B22] to-[#161B22]/80 border border-[#30363D] text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#E6EDF3]">
            Don't Want to Connect via OAuth?
          </h2>
          <p className="text-xs sm:text-sm text-[#8B949E] max-w-xl mx-auto">
            You don't have to! You can run every recipe manually on your own machine using the official GitHub CLI.
          </p>
          <div className="pt-2">
            <Link
              to="/blueprints/gitglow/engine"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D7FF36] text-[#0D1117] font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#cbf42e] transition-colors"
            >
              <Terminal className="w-4 h-4" />
              <span>Open Interactive CLI Engine →</span>
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <GitGlowFooter
        onScan={async (user) => {
          setTargetUsername(user);
          await runScan(user);
        }}
        isScanning={isScanning}
      />

    </div>
  );
};
export default GitGlowHowItWorksPage;
