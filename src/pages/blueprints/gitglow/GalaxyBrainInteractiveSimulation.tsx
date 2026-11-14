import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { BadgeRewardModal } from '../../../components/gitglow/BadgeRewardModal';

interface GalaxyBrainInteractiveSimulationProps {
  onCompleted?: () => void;
  onOpenLearnModal?: () => void;
}

export const GalaxyBrainInteractiveSimulation: React.FC<GalaxyBrainInteractiveSimulationProps> = ({
  onCompleted,
  onOpenLearnModal,
}) => {
  const { targetUsername, isBadgeOwned, runScan } = useGitGlowStore();
  const isAlreadyEarned = isBadgeOwned('galaxy-brain');

  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  // Template state for answer generator
  const [questionProblem, setQuestionProblem] = useState<string>('Vite build fails with "Cannot find module" when importing path');
  const [codeSolution, setCodeSolution] = useState<string>(
`// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});`
  );
  const [explanation, setExplanation] = useState<string>(
    'Ensure you also install @types/node if using TypeScript: npm i -D @types/node'
  );

  const generatedAnswerMarkdown = `### Solution:
The issue happens because Vite requires explicit path alias configuration in your \`vite.config.ts\`.

Here is the verified fix:
\`\`\`typescript
${codeSolution}
\`\`\`

**Why this works:**
${explanation}

Let me know if this resolves your build!`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generatedAnswerMarkdown);
    setCopiedSnippet('answer');
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const curatedDiscussionRepos = [
    {
      name: 'vercel/next.js',
      description: 'Massive Q&A section with hundreds of daily questions on routing, caching, and server components.',
      url: 'https://github.com/vercel/next.js/discussions?discussions_q=category%3AQ%26A+is%3Aunanswered',
      difficulty: 'Medium',
      tags: ['React', 'Next.js', 'SSR'],
    },
    {
      name: 'tailwindlabs/tailwindcss',
      description: 'High volume of practical CSS utility questions where clean snippets get accepted fast.',
      url: 'https://github.com/tailwindlabs/tailwindcss/discussions?discussions_q=category%3AQ%26A+is%3Aunanswered',
      difficulty: 'Easy',
      tags: ['CSS', 'Tailwind', 'Vite'],
    },
    {
      name: 'vitejs/vite',
      description: 'Fast-moving discussions on bundler configuration, plugin compatibility, and build scripts.',
      url: 'https://github.com/vitejs/vite/discussions?discussions_q=category%3AQ%26A+is%3Aunanswered',
      difficulty: 'Medium',
      tags: ['Vite', 'Build', 'Rollup'],
    },
    {
      name: 'freeCodeCamp/freeCodeCamp',
      description: 'Supportive community of learners asking conceptual JS, HTML, and backend questions.',
      url: 'https://github.com/freeCodeCamp/freeCodeCamp/discussions?discussions_q=is%3Aunanswered',
      difficulty: 'Beginner-Friendly',
      tags: ['Beginners', 'JavaScript', 'HTML'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. ACTIVE BADGE BANNER ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] p-2 flex items-center justify-center shrink-0">
              <img
                src="/images/badges/galaxy-brain.png"
                alt="Galaxy Brain Badge"
                className="w-full h-full object-contain filter drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#101114]">Galaxy Brain</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] text-[10px] font-bold">
                  2 Accepted Answers Required
                </span>
              </div>
              <p className="text-xs text-[#65666A] mt-0.5">
                Awarded when your answers in GitHub Discussions are marked as the official accepted solution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLearnModal && (
              <button
                onClick={onOpenLearnModal}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#65666A] hover:text-[#101114] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <BookOpen size={13} className="text-[#84CC16]" />
                <span>Discussions Playbook</span>
              </button>
            )}
            <a
              href={`https://github.com/${targetUsername}?tab=achievements`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#65666A] hover:text-[#101114] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>GitHub Profile</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Real Ground Truth Verification Rule */}
        <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs text-[#5B21B6] space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <Brain size={16} className="text-[#7C3AED]" />
            <span>The Ground Truth Rule for Galaxy Brain</span>
          </div>
          <p className="text-[11px] text-[#6D28D9] leading-relaxed">
            GitHub enforces that <strong>answers on repositories you own do NOT qualify</strong>. You must answer questions in external public repositories (community projects, popular libraries, etc.), and the author or maintainer must click <strong>&quot;Mark as answer&quot;</strong>. Once you have 2 accepted answers, GitHub grants the badge immediately.
          </p>
        </div>
      </div>

      {/* ── 2. ACTIVE OPEN-SOURCE Q&A FINDER ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Search size={18} className="text-[#7C3AED]" />
            <div>
              <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
                Live Repositories with Active Q&amp;A Discussions
              </h4>
              <p className="text-[11px] text-[#65666A]">
                Click any repository below to view open, unanswered questions waiting for solutions:
              </p>
            </div>
          </div>

          <a
            href="https://github.com/discussions?discussions_q=is%3Aunanswered+is%3Aopen+category%3AQ%26A"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-[11px] font-bold text-[#101114] hover:border-[#7C3AED] transition-all"
          >
            <span>Global Unanswered Search</span>
            <ExternalLink size={11} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {curatedDiscussionRepos.map((repo) => (
            <div
              key={repo.name}
              className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#7C3AED] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#101114]">{repo.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#E5E3DA] text-[9.5px] font-bold text-[#65666A]">
                    {repo.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-[#65666A] leading-relaxed">{repo.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {repo.tags.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.2 rounded-sm bg-[#EDE9FE] text-[#7C3AED] text-[9px] font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="w-full h-8 px-3 rounded-xl bg-white hover:bg-[#7C3AED] text-[#101114] hover:text-white border border-[#E5E3DA] hover:border-[#7C3AED] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Find Unanswered Questions</span>
                <ArrowRight size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. HIGH-ACCEPTANCE ANSWER BUILDER ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#84CC16]" />
          <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
            High-Acceptance Answer Generator (Proven Format)
          </h4>
        </div>
        <p className="text-[11px] text-[#65666A]">
          Answers that get clicked &quot;Mark as Answer&quot; follow a strict 3-tier structure: Minimal Code Fix + Brief &quot;Why it works&quot; + Friendly Closing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-[#65666A] uppercase tracking-wider block mb-1">
                Issue Summary / Question
              </label>
              <input
                type="text"
                value={questionProblem}
                onChange={(e) => setQuestionProblem(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-bold text-[#101114] focus:outline-hidden focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#65666A] uppercase tracking-wider block mb-1">
                Verified Code Fix (TypeScript/JS/Config)
              </label>
              <textarea
                rows={5}
                value={codeSolution}
                onChange={(e) => setCodeSolution(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-mono text-[#101114] focus:outline-hidden focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#65666A] uppercase tracking-wider block mb-1">
                Explanation / Caveat
              </label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs text-[#101114] focus:outline-hidden focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#101114] text-white flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-[#2A2B30] pb-2 mb-2">
                <span className="text-[10px] font-mono text-[#8E9099] uppercase">Generated Markdown Preview</span>
                <button
                  onClick={handleCopyMarkdown}
                  className="px-2.5 py-1 rounded-lg bg-[#202228] hover:bg-[#2F3138] text-xs font-mono text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet === 'answer' ? (
                    <>
                      <Check size={12} className="text-[#84CC16]" />
                      <span className="text-[#84CC16]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-[11px] font-mono text-[#D4D4D8] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {generatedAnswerMarkdown}
              </pre>
            </div>

            <div className="text-[10px] text-[#A1A1AA] pt-2 border-t border-[#2A2B30] flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#84CC16]" />
              <span>Ready to paste directly into GitHub Discussions reply box.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. VERIFY / PROGRESS CHECK ── */}
      <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-[#E5E3DA] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h5 className="text-xs font-bold text-[#101114]">Already posted 2 accepted answers?</h5>
          <p className="text-[11px] text-[#65666A] mt-0.5">
            Click &quot;Re-scan GitHub Profile&quot; to ingest your latest accepted answers directly from GitHub.
          </p>
        </div>

        <button
          onClick={() => runScan(targetUsername)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          Re-scan GitHub Achievements Tab
        </button>
      </div>

      <BadgeRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        badgeName="Galaxy Brain"
        badgeIcon="/images/badges/galaxy-brain.png"
        username={targetUsername}
        durationSeconds={45}
        issueNumber={1}
        itemType="pr"
        repoFullName="community/discussions"
        stat1Label="Accepted Answers"
        stat1Value="2 Solutions"
        stat1Sub="Marked as Answer"
        stat2Label="Scope"
        stat2Value="External Repos"
        stat2Sub="Community Q&A"
        onContinueToNext={() => {
          setShowRewardModal(false);
          if (onCompleted) onCompleted();
        }}
      />
    </div>
  );
};
