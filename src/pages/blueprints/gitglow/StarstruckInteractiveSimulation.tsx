import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Tag,
  Share2,
  BookOpen,
  Award,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { BadgeRewardModal } from '../../../components/gitglow/BadgeRewardModal';

interface StarstruckInteractiveSimulationProps {
  onCompleted?: () => void;
  onOpenLearnModal?: () => void;
}

interface UserRepo {
  name: string;
  full_name: string;
  stargazers_count: number;
  description: string | null;
  html_url: string;
  language: string | null;
}

export const StarstruckInteractiveSimulation: React.FC<StarstruckInteractiveSimulationProps> = ({
  onCompleted,
  onOpenLearnModal,
}) => {
  const { targetUsername, isBadgeOwned, runScan } = useGitGlowStore();
  const isAlreadyEarned = isBadgeOwned('starstruck');

  const [repos, setRepos] = useState<UserRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<UserRepo | null>(null);
  const [isLoadingRepos, setIsLoadingRepos] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  // Fetch real public repositories for target username
  const fetchUserRepos = async () => {
    setIsLoadingRepos(true);
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(targetUsername)}/repos?per_page=50&sort=updated`);
      if (res.ok) {
        const data: UserRepo[] = await res.json();
        const sorted = data.sort((a, b) => b.stargazers_count - a.stargazers_count);
        setRepos(sorted);
        if (sorted.length > 0) {
          setSelectedRepo(sorted[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load repositories:', e);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  useEffect(() => {
    fetchUserRepos();
  }, [targetUsername]);

  const currentStars = selectedRepo ? selectedRepo.stargazers_count : 0;
  const starsNeeded = Math.max(0, 16 - currentStars);
  const progressPercent = Math.min(100, Math.round((currentStars / 16) * 100));

  const repoName = selectedRepo?.name || 'my-project';
  const repoOwner = targetUsername || 'developer';

  const generatedReadme = `# ${repoName} 🚀

[![GitHub stars](https://img.shields.io/github/stars/${repoOwner}/${repoName}?style=social)](https://github.com/${repoOwner}/${repoName})
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/${repoOwner}/${repoName}/pulls)

> ${selectedRepo?.description || 'A modern, high-performance open-source project built for developers.'}

---

## ✨ Features
- ⚡ **Lightweight & Fast:** Zero bloat, optimal developer experience.
- 🛠️ **Production-Ready:** Built with clean architecture and type safety.
- 🤝 **Community-Driven:** Open for contributions, feedback, and issues.

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/${repoOwner}/${repoName}.git

# Navigate into project directory
cd ${repoName}

# Install dependencies
npm install

# Start development
npm run dev
\`\`\`

## 🌟 Support
If you find this project useful, please consider giving it a **Star ⭐** on GitHub!
`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const recommendedTopics = [
    'developer-tools',
    'open-source',
    'javascript',
    'typescript',
    'react',
    'vite',
    'productivity',
    'automation',
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. ACTIVE BADGE BANNER ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF9C3] border border-[#FEF08A] p-2 flex items-center justify-center shrink-0">
              <img
                src="/images/badges/starstruck.png"
                alt="Starstruck Badge"
                className="w-full h-full object-contain filter drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#101114]">Starstruck</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FEF9C3] text-[#A16207] border border-[#FEF08A] text-[10px] font-bold">
                  16 Stars on Single Repo Required
                </span>
              </div>
              <p className="text-xs text-[#65666A] mt-0.5">
                Awarded automatically when a single public repository created by you reaches 16 stars.
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
                <span>Star Playbook</span>
              </button>
            )}
            <a
              href={`https://github.com/${targetUsername}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#65666A] hover:text-[#101114] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>View Repositories</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Real Ground Truth Verification Rule */}
        <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-[#FEF08A] text-xs text-[#854D0E] space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <Star size={16} className="text-[#CA8A04] fill-[#CA8A04]" />
            <span>The Ground Truth Rule for Starstruck</span>
          </div>
          <p className="text-[11px] text-[#A16207] leading-relaxed">
            Stars are <strong>not cumulative across multiple repos</strong> — GitHub checks for <strong>16 stars on a single repository</strong>. The stars must come from 16 different GitHub accounts. Once your repository crosses 16 stars, GitHub awards the base Starstruck badge automatically.
          </p>
        </div>
      </div>

      {/* ── 2. REAL PUBLIC REPOSITORY STAR AUDITOR ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={18} className="text-[#EAB308]" />
            <div>
              <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
                Public Repositories Star Audit for @{targetUsername}
              </h4>
              <p className="text-[11px] text-[#65666A]">
                Select your top repository to view star progress and generate promotion assets:
              </p>
            </div>
          </div>

          <button
            onClick={fetchUserRepos}
            disabled={isLoadingRepos}
            className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-bold text-[#101114] hover:border-[#84CC16] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw size={12} className={cn(isLoadingRepos && 'animate-spin')} />
            <span>Refresh</span>
          </button>
        </div>

        {repos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {repos.slice(0, 6).map((repo) => {
              const isSelected = selectedRepo?.name === repo.name;
              return (
                <div
                  key={repo.name}
                  onClick={() => setSelectedRepo(repo)}
                  className={cn(
                    'p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2',
                    isSelected
                      ? 'bg-[#FEFCE8] border-[#EAB308] shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5E3DA] hover:border-[#EAB308]'
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#101114] truncate">
                        {repo.name}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#A16207]">
                        <Star size={12} className="fill-[#CA8A04] text-[#CA8A04]" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#65666A] line-clamp-2">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E5E3DA] flex items-center justify-between text-[10px]">
                    <span className="font-mono text-[#65666A]">{repo.language || 'Code'}</span>
                    <span className="font-bold text-[#CA8A04]">
                      {repo.stargazers_count >= 16 ? 'Qualified!' : `${16 - repo.stargazers_count} needed`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#65666A] bg-[#FAF9F5] rounded-2xl border border-dashed border-[#E5E3DA]">
            {isLoadingRepos ? 'Scanning public repositories...' : 'No public repositories found for this username.'}
          </div>
        )}

        {/* Selected Repo Progress Meter */}
        {selectedRepo && (
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECEAE1] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#101114]">
                Target: {selectedRepo.name} ({currentStars}/16 Stars)
              </span>
              <span className="font-mono font-bold text-[#CA8A04]">
                {currentStars >= 16 ? '🎉 16-STAR MILESTONE REACHED!' : `${starsNeeded} more stars needed`}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#E5E3DA] overflow-hidden">
              <div
                className="h-full bg-[#EAB308] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 3. STAR-CONVERTING README BUILDER ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#84CC16]" />
            <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
              High-Converting README Generator for {repoName}
            </h4>
          </div>

          <button
            onClick={() => handleCopy(generatedReadme, 'readme')}
            className="px-3 py-1.5 rounded-xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copiedSnippet === 'readme' ? (
              <>
                <Check size={12} className="text-[#84CC16]" />
                <span className="text-[#84CC16]">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy README.md</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#101114] text-white space-y-2">
          <div className="text-[10px] font-mono text-[#8E9099] uppercase border-b border-[#2A2B30] pb-2">
            README.md Preview (Includes Live Star Counter Badge)
          </div>
          <pre className="text-[11px] font-mono text-[#D4D4D8] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {generatedReadme}
          </pre>
        </div>
      </div>

      {/* ── 4. RECOMMENDED REPO TOPICS (SEO BOOST) ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-[#3B82F6]" />
          <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
            High-Search Topics to Add (Repository &gt; About &gt; Topics)
          </h4>
        </div>
        <p className="text-[11px] text-[#65666A]">
          Adding these topics to your GitHub repository makes it appear in topic search feeds across GitHub:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {recommendedTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleCopy(topic, topic)}
              className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-mono text-[#1D4ED8] hover:bg-[#DBEAFE] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>#{topic}</span>
              {copiedSnippet === topic ? <Check size={10} /> : <Copy size={10} />}
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. VERIFY / PROFILE CHECK ── */}
      <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-[#E5E3DA] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h5 className="text-xs font-bold text-[#101114]">Hit 16 stars on your repository?</h5>
          <p className="text-[11px] text-[#65666A] mt-0.5">
            Click &quot;Re-scan GitHub Profile&quot; to verify your Starstruck badge.
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
        badgeName="Starstruck"
        badgeIcon="/images/badges/starstruck.png"
        username={targetUsername}
        durationSeconds={120}
        issueNumber={16}
        itemType="pr"
        repoFullName={`${targetUsername}/${selectedRepo?.name || 'repository'}`}
        stat1Label="Stargazers"
        stat1Value="16 Stars"
        stat1Sub="Single Public Repo"
        stat2Label="Award Tier"
        stat2Value="Base Tier"
        stat2Sub="Automatic GitHub Grant"
        onContinueToNext={() => {
          setShowRewardModal(false);
          if (onCompleted) onCompleted();
        }}
      />
    </div>
  );
};
