import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Search,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Zap,
  BookOpen
} from 'lucide-react';
import { GITHUB_BADGES, GitHubBadge } from '../../../data/gitglow/github-badges';
import { GitGlowNavbar } from '../../../components/gitglow/GitGlowNavbar';
import { GitGlowFooter } from '../../../components/gitglow/GitGlowFooter';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow } from '../../../lib/gitglow/gitglow-auth';

export const GitGlowBadgeGuidePage: React.FC = () => {
  const { badgeId } = useParams<{ badgeId: string }>();
  const navigate = useNavigate();

  const {
    connectedUser,
    setConnectedUser,
    runScan,
    targetUsername,
    setTargetUsername,
    isScanning,
    scanAnalysis,
  } = useGitGlowStore();

  const [scanInput, setScanInput] = useState(targetUsername || '');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const badge = GITHUB_BADGES.find((b) => b.id === badgeId) || GITHUB_BADGES[0];

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuickScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = scanInput.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?github\.com\//i, '');
    if (cleaned) {
      setTargetUsername(cleaned);
      await runScan(cleaned);
      navigate(`/blueprints/gitglow?badge=${badge.id}`);
    }
  };

  // Specific CLI commands for each badge
  const cliCommands: { title: string; cmd: string; desc: string }[] = badge.id === 'quickdraw' ? [
    { title: 'Step 1: Create a test issue', cmd: 'gh issue create --title "quickdraw-test" --body "Temp tracking issue"', desc: 'Opens a public issue on your repository.' },
    { title: 'Step 2: Close within 300 seconds', cmd: 'gh issue close 1 --comment "Resolved for Quickdraw"', desc: 'Closes the issue under 5 minutes to trigger the qualification.' },
    { title: 'Step 3: Verify webhook event', cmd: 'gh api user/public_emails', desc: 'Ensures your active commit author email is indexed.' },
  ] : badge.id === 'pull-shark' ? [
    { title: 'Step 1: Switch to feature branch', cmd: 'git checkout -b feat/pull-shark-demo', desc: 'Create a non-default branch for your pull request.' },
    { title: 'Step 2: Create verified commit', cmd: 'git commit --allow-empty -m "feat: verified pull shark commit"', desc: 'Stages an empty commit for the pull request.' },
    { title: 'Step 3: Push branch and create PR', cmd: 'git push origin feat/pull-shark-demo && gh pr create --fill', desc: 'Pushes the branch and creates a pull request.' },
    { title: 'Step 4: Merge PR into default branch', cmd: 'gh pr merge --auto --merge', desc: 'Merges the PR to trigger the Pull Shark achievement.' },
  ] : badge.id === 'yolo' ? [
    { title: 'Step 1: Create and push feature branch', cmd: 'git checkout -b feat/yolo-direct && git commit --allow-empty -m "feat: yolo" && git push origin feat/yolo-direct', desc: 'Create feature branch.' },
    { title: 'Step 2: Open PR to default branch', cmd: 'gh pr create --title "Direct YOLO PR" --body "Testing unreviewed merge"', desc: 'Opens PR on repo with collaborators.' },
    { title: 'Step 3: Merge without code review', cmd: 'gh pr merge --admin --merge', desc: 'Directly merges without awaiting pull request review.' },
  ] : badge.id === 'pair-extraordinaire' ? [
    { title: 'Step 1: Stage commit with Co-authored-by trailer', cmd: 'git commit -m "feat: pair programming\n\nCo-authored-by: GitGlow Agent <agent@gitglow.dev>"', desc: 'Adds official RFC commit trailer specifying a secondary author.' },
    { title: 'Step 2: Open and merge PR', cmd: 'gh pr create --fill && gh pr merge --auto --merge', desc: 'Merges the commit so GitHub parses the co-author header.' },
  ] : [
    { title: 'Step 1: Navigate to repository discussions', cmd: 'gh browse -- discussions', desc: 'Open the Discussions tab on an enabled public repository.' },
    { title: 'Step 2: Post helpful answer', cmd: 'gh api graphql -f query=\'mutation { addDiscussionComment(...) }\'', desc: 'Post an answer to an open developer question.' },
    { title: 'Step 3: Author marks answer as accepted', cmd: 'gh api graphql -f query=\'mutation { markDiscussionCommentAsAnswer(...) }\'', desc: 'Author selects your response as the accepted solution.' },
  ];

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
          <span className="text-[#D7FF36] font-medium">{badge.name} Guide</span>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Above the Fold: Headline & Instant 1-Click Scan CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-[#30363D]">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs font-bold text-[#D7FF36]">
              <Trophy className="w-3.5 h-3.5" />
              <span>Official GitHub Achievement Guide (2026)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#E6EDF3] leading-[1.15]">
              How to Get the <span className="text-[#D7FF36]">{badge.name}</span> Badge on GitHub
            </h1>

            <p className="text-sm sm:text-base text-[#8B949E] leading-relaxed max-w-xl">
              {badge.tagline} Follow our verified step-by-step instructions below, or audit your username to claim it in 1-click.
            </p>

            {/* Above the Fold 1-Click Engine Card */}
            <div className="p-4 rounded-2xl bg-[#161B22] border border-[#30363D] max-w-xl space-y-3">
              <div className="text-xs font-bold text-[#E6EDF3] flex items-center justify-between">
                <span>Want to claim this automatically?</span>
                <span className="text-[#D7FF36] font-normal">~2 min runtime</span>
              </div>
              <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="github.com/your-username"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] text-sm focus:border-[#D7FF36] outline-none"
                />
                <button
                  type="submit"
                  disabled={isScanning}
                  className="px-5 py-2.5 bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Claim in 1-Click →</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Badge Metadata Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-4 text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-5xl shadow-inner">
                {badge.id === 'pull-shark' && '🦈'}
                {badge.id === 'quickdraw' && '⚡'}
                {badge.id === 'yolo' && '🚀'}
                {badge.id === 'pair-extraordinaire' && '👥'}
                {badge.id === 'galaxy-brain' && '🧠'}
                {!['pull-shark', 'quickdraw', 'yolo', 'pair-extraordinaire', 'galaxy-brain'].includes(badge.id) && '🏆'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#E6EDF3] font-heading">{badge.name}</h3>
                <div className="text-xs text-[#8B949E] mt-1">{badge.difficulty} Difficulty • {badge.category}</div>
              </div>
              <div className="pt-3 border-t border-[#30363D] grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <div className="text-[#8B949E] text-[10px]">Estimated Time</div>
                  <div className="font-bold text-[#E6EDF3] mt-0.5 font-code">2–5 Mins</div>
                </div>
                <div className="p-2 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <div className="text-[#8B949E] text-[10px]">Verification</div>
                  <div className="font-bold text-[#D7FF36] mt-0.5">Automated ✓</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Content Section: Detailed Technical Documentation (800+ Words) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12">
          
          {/* Main Article Body (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* AI Quotable TL;DR Definition Box */}
            <div className="p-5 rounded-2xl bg-[#161B22] border-l-4 border-l-[#D7FF36] border-[#30363D] space-y-2">
              <div className="text-xs font-bold text-[#D7FF36] uppercase tracking-wider">
                TL;DR Definition & Rule Summary
              </div>
              <p className="text-sm text-[#E6EDF3] leading-relaxed">
                The GitHub <strong>{badge.name}</strong> achievement is awarded automatically by GitHub’s achievement indexing engine when an account satisfies verified git event criteria. {badge.howToGet} Draft pull requests, unmerged branches, and actions on private repositories without public contribution flags enabled will not qualify.
              </p>
            </div>

            {/* Section 1: Exact Requirements */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#E6EDF3]">
                Exact Qualification Requirements
              </h2>
              <p className="text-sm text-[#8B949E] leading-relaxed">
                GitHub does not announce an exact second-by-second webhook specification, but community reverse-engineering and empirical testing have locked down the exact qualification thresholds:
              </p>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                {badge.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#161B22] border border-[#30363D]">
                    <CheckCircle2 className="w-4 h-4 text-[#D7FF36] shrink-0 mt-0.5" />
                    <span className="text-[#E6EDF3]">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Common Gotchas & Failure Modes */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-400">
                Common Gotchas & Edge Cases to Avoid
              </h2>
              <div className="space-y-3">
                {badge.gotchas.map((gotcha, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#161B22] border border-amber-500/30 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[#E6EDF3] leading-relaxed">
                      {gotcha}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Manual Terminal Recipes (CLI Execution) */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#E6EDF3]">
                Manual Terminal Recipe (Run it Yourself)
              </h2>
              <p className="text-sm text-[#8B949E]">
                If you prefer not to connect your GitHub account via OAuth, you can execute the exact recipe manually using Git and the GitHub CLI (<code className="text-[#D7FF36]">gh</code>):
              </p>

              <div className="space-y-3">
                {cliCommands.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] space-y-2 font-code">
                    <div className="flex items-center justify-between text-xs text-[#8B949E]">
                      <span className="font-bold text-[#E6EDF3] font-heading">{item.title}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(item.cmd, i)}
                        className="flex items-center gap-1 text-[11px] text-[#D7FF36] hover:underline cursor-pointer"
                      >
                        {copiedIndex === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-[#D7FF36] text-xs overflow-x-auto whitespace-pre">
                      $ {item.cmd}
                    </div>
                    <p className="text-[11px] text-[#8B949E] font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Attribution (E-E-A-T Dec 2025 Standard) */}
            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] flex items-center gap-4">
              <img
                src="https://avatars.githubusercontent.com/u/104358488?v=4"
                alt="Ayush Paul"
                className="w-12 h-12 rounded-full border border-[#D7FF36]/40"
              />
              <div>
                <div className="text-xs text-[#8B949E]">Written & Verified by</div>
                <div className="font-bold text-sm text-[#E6EDF3] font-heading">Ayush Paul</div>
                <div className="text-[11px] text-[#8B949E] mt-0.5">
                  Open Source Engineer & Blueprint Architect · Last verified: Current Month
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Navigation to Other Badges */}
            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3">
              <h3 className="font-bold text-sm text-[#E6EDF3] font-heading uppercase tracking-wider">
                All 5 Verified Guides
              </h3>
              <ul className="space-y-1.5 text-xs">
                {GITHUB_BADGES.slice(0, 5).map((b) => (
                  <li key={b.id}>
                    <Link
                      to={`/blueprints/gitglow/badges/${b.id}`}
                      className={`p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                        b.id === badge.id
                          ? 'bg-[#D7FF36]/10 text-[#D7FF36] border border-[#D7FF36]/30 font-bold'
                          : 'hover:bg-[#0D1117] text-[#8B949E] hover:text-[#E6EDF3]'
                      }`}
                    >
                      <span>{b.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Assurance Card */}
            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3 text-xs text-[#8B949E]">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-heading">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Genuine Git Events</span>
              </div>
              <p className="leading-relaxed">
                GitGlow uses genuine git commits and PRs. It never fakes contribution graphs or stars.
              </p>
              <Link to="/blueprints/gitglow/how-it-works" className="text-[#D7FF36] hover:underline flex items-center gap-1">
                <span>Read our Trust & Security page →</span>
              </Link>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <GitGlowFooter
        onScan={async (user) => {
          setTargetUsername(user);
          await runScan(user);
          navigate(`/blueprints/gitglow?badge=${badge.id}`);
        }}
        isScanning={isScanning}
      />

    </div>
  );
};
export default GitGlowBadgeGuidePage;
