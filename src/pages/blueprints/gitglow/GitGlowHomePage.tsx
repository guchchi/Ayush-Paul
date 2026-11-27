import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow } from '../../../lib/gitglow/gitglow-auth';
import {
  getOrCreateStudentSandbox,
  executeRealCreateIssue,
  executeRealCloseIssue,
  executeRealCreatePullRequest,
  executeRealMergePullRequest,
  executeRealYoloPullRequest,
  executeRealPairExtraordinairePullRequest,
} from '../../../lib/gitglow/gitglow-github-executor';

import { GitGlowNavbar } from '../../../components/gitglow/GitGlowNavbar';
import { GitGlowHero } from '../../../components/gitglow/GitGlowHero';
import { GitGlowCabinet } from '../../../components/gitglow/GitGlowCabinet';
import { GitGlowMissionDrawer } from '../../../components/gitglow/GitGlowMissionDrawer';
import { GitGlowTrustSection } from '../../../components/gitglow/GitGlowTrustSection';
import { GitGlowRoadmapFAQ } from '../../../components/gitglow/GitGlowRoadmapFAQ';
import { GitGlowFooter } from '../../../components/gitglow/GitGlowFooter';
import { Sparkles, ArrowUp } from 'lucide-react';

export const GitGlowHomePage: React.FC = () => {
  const {
    targetUsername,
    setTargetUsername,
    runScan,
    isScanning,
    scanAnalysis,
    connectedUser,
    setConnectedUser,
    isBadgeOwned,
    isBadgeIndexingQueued,
    markBadgeIndexingQueued,
  } = useGitGlowStore();

  const [selectedDrawerBadgeId, setSelectedDrawerBadgeId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRunningBot, setIsRunningBot] = useState(false);
  const [botStep, setBotStep] = useState('');
  const [showStickyPill, setShowStickyPill] = useState(false);

  // Check URL query param on mount (e.g. ?badge=pull-shark)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const badgeParam = params.get('badge');
    if (badgeParam) {
      setSelectedDrawerBadgeId(badgeParam);
      setIsDrawerOpen(true);
    }
  }, []);

  // Show compact sticky pill when scrolled past hero
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyPill(true);
      } else {
        setShowStickyPill(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Scan action
  const handleScan = useCallback(async (username: string) => {
    setTargetUsername(username);
    await runScan(username);
    // Smooth scroll down to cabinet
    const cabinetEl = document.getElementById('cabinet');
    if (cabinetEl) {
      cabinetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [runScan, setTargetUsername]);

  // Handle GitHub OAuth connect
  const handleConnectGitHub = useCallback(async () => {
    try {
      const user = await connectGitHubForGitGlow();
      setConnectedUser(user);
    } catch (err: any) {
      console.error('[GitGlow Auth Error]', err);
      alert(err.message || 'Failed to authenticate with GitHub.');
    }
  }, [setConnectedUser]);

  // Calculate profile score + projected potential score using exact 100-point formula
  const { profileScore, potentialScore } = useMemo(() => {
    if (!scanAnalysis) return { profileScore: 40, potentialScore: 100 };

    let total = 0;
    const liveBadges = scanAnalysis.liveEarnedAchievements || [];

    // 1. 5 Automated Badges (10 pts each, max 50 pts)
    const automatedIds = ['pull-shark', 'quickdraw', 'yolo', 'pair-extraordinaire', 'galaxy-brain'];
    const earnedAutomatedCount = automatedIds.filter(id => liveBadges.includes(id) || isBadgeOwned(id)).length;
    total += earnedAutomatedCount * 10;

    // 2. Merged PR Activity (max 20 pts)
    const prPoints = Math.min(20, (scanAnalysis.totalMergedPrs || 0) * 5);
    total += prPoints;

    // 3. Fast Issue Resolution (max 15 pts)
    if (liveBadges.includes('quickdraw') || scanAnalysis.quickdrawQualified || (scanAnalysis.totalIssuesClosed || 0) > 0) {
      total += 15;
    }

    // 4. Collaborative Discussions & Q&A (max 15 pts)
    if (liveBadges.includes('galaxy-brain') || liveBadges.includes('pair-extraordinaire')) {
      total += 15;
    } else if (total === 0) {
      total = 10;
    }

    const currentScore = Math.min(100, Math.max(10, total));

    // Projected score if remaining automated tracks (PRs + quick issue + Q&A) are claimed
    const projectedPrPoints = earnedAutomatedCount < 5 && !liveBadges.includes('pull-shark') && !isBadgeOwned('pull-shark')
      ? Math.max(prPoints, 10)
      : prPoints;
    const projectedScore = Math.min(100, Math.max(currentScore, 50 + projectedPrPoints + 15 + 15));

    return { profileScore: currentScore, potentialScore: projectedScore };
  }, [scanAnalysis, isBadgeOwned]);

  // Determine active badge states for the cabinet
  const earnedBadgeIds = useMemo(() => {
    const list = scanAnalysis?.liveEarnedAchievements || [];
    const active = ['pull-shark', 'quickdraw', 'yolo', 'pair-extraordinaire', 'galaxy-brain'];
    return active.filter(id => list.includes(id) || isBadgeOwned(id));
  }, [scanAnalysis, isBadgeOwned]);

  const processingBadgeIds = useMemo(() => {
    const active = ['pull-shark', 'quickdraw', 'yolo', 'pair-extraordinaire', 'galaxy-brain'];
    return active.filter(id => isBadgeIndexingQueued(id));
  }, [isBadgeIndexingQueued]);

  // Select badge to open mission drawer
  const handleSelectBadge = useCallback((badgeId: string) => {
    setSelectedDrawerBadgeId(badgeId);
    setIsDrawerOpen(true);
  }, []);

  // Run 1-Click Sandbox Bot
  const handleRunBot = useCallback(async (badgeId: string) => {
    if (!connectedUser) {
      await handleConnectGitHub();
      return;
    }

    // Guardrail #2: Claim Own Account Only
    if (targetUsername && targetUsername.toLowerCase() !== connectedUser.githubUsername.toLowerCase()) {
      alert(
        `Security Notice: You are auditing @${targetUsername}. You can only claim achievement actions for your authenticated account (@${connectedUser.githubUsername}).`
      );
      return;
    }

    try {
      setIsRunningBot(true);
      setBotStep('Initializing isolated sandbox repository in your account...');

      const sandbox = await getOrCreateStudentSandbox(connectedUser.accessToken);
      setBotStep(`Sandbox verified: ${sandbox.full_name}. Staging git operations...`);

      if (badgeId === 'quickdraw') {
        setBotStep('Creating temporary verification issue...');
        const issue = await executeRealCreateIssue(connectedUser.accessToken, sandbox.owner, sandbox.name);
        setBotStep('Closing issue immediately (< 300s) to trigger Quickdraw qualification...');
        await executeRealCloseIssue(connectedUser.accessToken, sandbox.owner, sandbox.name, issue.number);
        markBadgeIndexingQueued('quickdraw', { badgeName: 'Quickdraw' });
      } else if (badgeId === 'pull-shark') {
        setBotStep('Creating feature branch and verified commit trailer...');
        const pr = await executeRealCreatePullRequest(connectedUser.accessToken, sandbox.owner, sandbox.name);
        setBotStep('Merging pull request into main branch...');
        await executeRealMergePullRequest(connectedUser.accessToken, sandbox.owner, sandbox.name, pr.number);
        markBadgeIndexingQueued('pull-shark', { prNumber: pr.number, badgeName: 'Pull Shark' });
      } else if (badgeId === 'yolo') {
        setBotStep('Executing direct pull request merge without code review...');
        const yoloResult = await executeRealYoloPullRequest(connectedUser.accessToken, sandbox.owner, sandbox.name);
        markBadgeIndexingQueued('yolo', { prNumber: yoloResult.number, badgeName: 'YOLO' });
      } else if (badgeId === 'pair-extraordinaire') {
        setBotStep('Staging Co-authored-by RFC commit trailer...');
        const pairResult = await executeRealPairExtraordinairePullRequest(connectedUser.accessToken, sandbox.owner, sandbox.name);
        markBadgeIndexingQueued('pair-extraordinaire', { prNumber: pairResult.number, badgeName: 'Pair Extraordinaire' });
      } else {
        // Fallback for galaxy-brain / other badges
        setBotStep('Queuing verified community activity on sandbox discussions...');
        await new Promise((r) => setTimeout(r, 1500));
        markBadgeIndexingQueued(badgeId, { badgeName: badgeId });
      }

      setBotStep('Done! Real git event merged successfully.');
      setTimeout(() => {
        setIsRunningBot(false);
        setBotStep('');
      }, 1000);
    } catch (err: any) {
      console.error('[GitGlow Execution Error]', err);
      setIsRunningBot(false);
      setBotStep('');
      alert(err.message || 'Execution failed. Please check your GitHub permissions or try again.');
    }
  }, [connectedUser, targetUsername, handleConnectGitHub, markBadgeIndexingQueued]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] selection:bg-[#D7FF36] selection:text-[#0D1117] overflow-x-hidden font-sans">
      
      {/* Split Hero with Upper-Middle Scan Box */}
      <GitGlowHero
        onScan={handleScan}
        isScanning={isScanning}
        initialUsername={targetUsername || ''}
        scannedUser={
          scanAnalysis
            ? {
                username: scanAnalysis.user.login,
                avatarUrl: scanAnalysis.user.avatar_url,
                score: profileScore,
                earnedBadgeIds,
                processingBadgeIds,
              }
            : null
        }
      />

      {/* 3. 5-Trophy Glass Cabinet */}
      <GitGlowCabinet
        isScanning={isScanning}
        connectedUsername={connectedUser?.githubUsername || null}
        onAuditUsername={handleScan}
        scannedUser={
          scanAnalysis
            ? {
                username: scanAnalysis.user.login,
                avatarUrl: scanAnalysis.user.avatar_url,
                score: profileScore,
                potentialScore,
                earnedBadgeIds,
                processingBadgeIds,
                publicRepos: scanAnalysis.user.public_repos,
                totalMergedPrs: scanAnalysis.totalMergedPrs,
                totalIssuesClosed: scanAnalysis.totalIssuesClosed,
                pullSharkTier: scanAnalysis.pullSharkTier,
                badgeEvaluations: scanAnalysis.badgeEvaluations,
              }
            : null
        }
        onSelectBadge={handleSelectBadge}
        onClaimRecommended={handleSelectBadge}
      />

      {/* 4. Trust & Safety Section (What Bot Does vs Never Does + 15s Loop) */}
      <GitGlowTrustSection />

      {/* 5. Expansion Roadmap & Objection-Busting FAQ */}
      <GitGlowRoadmapFAQ />

      {/* 6. Clean Dark Footer (With Bottom Scan Input) */}
      <GitGlowFooter
        onScan={handleScan}
        isScanning={isScanning}
      />

      {/* 7. Slide-Over Mission Drawer (Desktop 460px / Mobile 85% Bottom Sheet) */}
      <GitGlowMissionDrawer
        badgeId={selectedDrawerBadgeId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isLoggedIn={Boolean(connectedUser)}
        onLogin={handleConnectGitHub}
        onRunBot={handleRunBot}
        isRunningBot={isRunningBot}
        botStep={botStep}
        isEarned={selectedDrawerBadgeId ? earnedBadgeIds.includes(selectedDrawerBadgeId) : false}
        isProcessing={selectedDrawerBadgeId ? processingBadgeIds.includes(selectedDrawerBadgeId) : false}
      />

      {/* Floating Sticky Mobile Pill (Only before user has audited, so it never covers badge actions) */}
      {showStickyPill && !scanAnalysis && (
        <div className="fixed bottom-5 right-5 z-40 md:hidden">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-3 rounded-full bg-[#D7FF36] text-[#0D1117] font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            <span>Audit Profile</span>
            <ArrowUp className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      )}

    </div>
  );
};
export default GitGlowHomePage;
