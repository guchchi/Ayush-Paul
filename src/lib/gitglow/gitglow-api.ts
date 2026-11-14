/**
 * GitGlow GitHub API Service & Precise Badge Evaluator
 * Zero OAuth required - reads public REST endpoints.
 */

export interface GitHubUserProfile {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  created_at: string;
  html_url: string;
}

export interface BadgeStatusEvaluation {
  badgeId: string;
  name: string;
  isUnlocked: boolean;
  statusLabel: string;
  badgeLevel?: string; // e.g. "x2 (Bronze)", "Default"
  progressPercent: number;
  currentValue: number;
  targetValue: number;
  detail: string;
  actionRecommendation: string;
}

export interface UserScanAnalysis {
  user: GitHubUserProfile;
  totalMergedPrs: number;
  totalIssuesClosed: number;
  quickdrawQualified: boolean;
  quickdrawDurationSeconds?: number;
  pullSharkTier: 'None' | 'Default (Unlocked)' | 'Bronze (x2)' | 'Silver (x3)' | 'Gold (x4)';
  badgeEvaluations: Record<string, BadgeStatusEvaluation>;
  recentMergedPrs: Array<{
    title: string;
    url: string;
    repository: string;
    merged_at: string;
  }>;
  liveEarnedAchievements: string[];
  scannedAt: string;
}

/**
 * Fetch GitHub user public profile
 */
export async function fetchGitHubProfile(username: string): Promise<GitHubUserProfile> {
  const cleanHandle = username.trim().replace(/^@/, '');
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanHandle)}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`GitHub user "@${cleanHandle}" not found. Please check spelling.`);
    } else if (res.status === 403) {
      throw new Error('GitHub API rate limit reached. Please wait a minute or test with another handle.');
    }
    throw new Error(`Failed to fetch GitHub profile (Status: ${res.status})`);
  }

  return res.json();
}

/**
 * Perform full analysis of public GitHub telemetry for badge qualification
 */
export async function analyzeGitHubProfile(username: string): Promise<UserScanAnalysis> {
  const cleanHandle = username.trim().replace(/^@/, '');
  const user = await fetchGitHubProfile(cleanHandle);

  // 1. Fetch Merged PRs
  let totalMergedPrs = 0;
  let recentMergedPrs: Array<{ title: string; url: string; repository: string; merged_at: string }> = [];

  try {
    const prRes = await fetch(
      `https://api.github.com/search/issues?q=author:${encodeURIComponent(cleanHandle)}+type:pr+is:merged&sort=updated&per_page=5`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (prRes.ok) {
      const prData = await prRes.json();
      totalMergedPrs = prData.total_count || 0;
      recentMergedPrs = (prData.items || []).map((item: any) => ({
        title: item.title,
        url: item.html_url,
        repository: item.repository_url.replace('https://api.github.com/repos/', ''),
        merged_at: item.closed_at,
      }));
    }
  } catch (err) {
    console.warn('PR search error:', err);
  }

  // 2. Fetch Closed Issues & Calculate Quickdraw Durations
  let totalIssuesClosed = 0;
  let quickdrawQualified = false;
  let quickdrawDurationSeconds: number | undefined = undefined;

  try {
    const issueRes = await fetch(
      `https://api.github.com/search/issues?q=author:${encodeURIComponent(cleanHandle)}+type:issue+is:closed&sort=updated&per_page=10`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (issueRes.ok) {
      const issueData = await issueRes.json();
      totalIssuesClosed = issueData.total_count || 0;
      const items = issueData.items || [];

      for (const item of items) {
        if (item.created_at && item.closed_at) {
          const created = new Date(item.created_at).getTime();
          const closed = new Date(item.closed_at).getTime();
          const diffSec = Math.round((closed - created) / 1000);
          if (diffSec >= 0 && diffSec <= 300) {
            quickdrawQualified = true;
            quickdrawDurationSeconds = diffSec;
            break;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Issue search error:', err);
  }

  // 3. Determine Pull Shark Tier
  let pullSharkTier: 'None' | 'Default (Unlocked)' | 'Bronze (x2)' | 'Silver (x3)' | 'Gold (x4)' = 'None';
  if (totalMergedPrs >= 1024) pullSharkTier = 'Gold (x4)';
  else if (totalMergedPrs >= 128) pullSharkTier = 'Silver (x3)';
  else if (totalMergedPrs >= 16) pullSharkTier = 'Bronze (x2)';
  else if (totalMergedPrs >= 2) pullSharkTier = 'Default (Unlocked)';

  // 3.5 Check Live Public GitHub Achievements Page (Ground Truth)
  let liveEarnedAchievements: string[] = [];
  try {
    const liveRes = await fetch(`/api/gitglow/achievements/${encodeURIComponent(cleanHandle)}`);
    if (liveRes.ok) {
      const data = await liveRes.json();
      if (Array.isArray(data.achievements)) {
        liveEarnedAchievements = data.achievements;
      }
    }
  } catch (err) {
    console.warn('Live achievements check skipped:', err);
  }

  const hasQuickdraw = liveEarnedAchievements.includes('quickdraw') || quickdrawQualified;
  const hasPullShark = liveEarnedAchievements.includes('pull-shark') || totalMergedPrs >= 2;
  const hasYolo = liveEarnedAchievements.includes('yolo');
  const hasPair = liveEarnedAchievements.includes('pair-extraordinaire');
  const hasGalaxyBrain = liveEarnedAchievements.includes('galaxy-brain');
  const hasStarstruck = liveEarnedAchievements.includes('starstruck');

  // 4. Construct Precise Evaluation Map
  const badgeEvaluations: Record<string, BadgeStatusEvaluation> = {
    quickdraw: {
      badgeId: 'quickdraw',
      name: 'Quickdraw',
      isUnlocked: hasQuickdraw,
      statusLabel: hasQuickdraw ? 'Already Earned' : 'Not Yet Earned',
      progressPercent: hasQuickdraw ? 100 : 0,
      currentValue: hasQuickdraw ? 1 : 0,
      targetValue: 1,
      detail: hasQuickdraw
        ? `Verified! Found on your GitHub profile achievement tab${quickdrawDurationSeconds ? ` (resolved in ${quickdrawDurationSeconds}s)` : ''}.`
        : totalIssuesClosed > 0
        ? `Found ${totalIssuesClosed} closed issue(s), but none closed within the strict 5-minute (300s) window.`
        : 'No closed issues detected under your account.',
      actionRecommendation: hasQuickdraw
        ? 'Badge already awarded on your profile! You can still practice the fast triage workflow.'
        : 'Follow the 120-second Quickdraw blueprint: open an issue and close it in under 5 minutes.',
    },
    'pull-shark': {
      badgeId: 'pull-shark',
      name: 'Pull Shark',
      isUnlocked: hasPullShark,
      badgeLevel: pullSharkTier !== 'None' ? pullSharkTier : (hasPullShark ? 'Default (Unlocked)' : undefined),
      statusLabel: hasPullShark ? `Earned (${pullSharkTier !== 'None' ? pullSharkTier : 'Default'})` : `${totalMergedPrs}/2 Merged PRs`,
      progressPercent: hasPullShark ? 100 : Math.min(100, Math.round((totalMergedPrs / 2) * 100)),
      currentValue: totalMergedPrs,
      targetValue: 2,
      detail: hasPullShark
        ? `Qualified! Active on your GitHub profile with ${totalMergedPrs} merged PRs.`
        : `Needs ${Math.max(0, 2 - totalMergedPrs)} more merged PR into default branch to unlock.`,
      actionRecommendation: hasPullShark
        ? 'Aim for 16 merged PRs to unlock the Bronze (x2) tier badge border!'
        : 'Open and merge 2 PRs using our verified sandbox workflow or personal repo.',
    },
    yolo: {
      badgeId: 'yolo',
      name: 'YOLO',
      isUnlocked: hasYolo,
      statusLabel: hasYolo ? 'Already Earned' : 'Not Yet Earned',
      progressPercent: hasYolo ? 100 : 0,
      currentValue: hasYolo ? 1 : 0,
      targetValue: 1,
      detail: hasYolo
        ? 'Verified! YOLO achievement is active on your GitHub profile.'
        : 'Requires merging a pull request without code review on a collaborative repo.',
      actionRecommendation: 'Merge a PR directly without assigning reviewers to qualify.',
    },
    'pair-extraordinaire': {
      badgeId: 'pair-extraordinaire',
      name: 'Pair Extraordinaire',
      isUnlocked: hasPair,
      statusLabel: hasPair ? 'Already Earned' : 'Co-Authoring Required',
      progressPercent: hasPair ? 100 : 0,
      currentValue: hasPair ? 1 : 0,
      targetValue: 1,
      detail: hasPair
        ? 'Verified! Pair Extraordinaire is active on your GitHub profile.'
        : 'Requires an RFC Git trailer: "Co-authored-by: Name <email>" in a merged commit.',
      actionRecommendation: 'Follow the Pair Extraordinaire blueprint to craft an authentic co-authored commit.',
    },
    'galaxy-brain': {
      badgeId: 'galaxy-brain',
      name: 'Galaxy Brain',
      isUnlocked: hasGalaxyBrain,
      statusLabel: hasGalaxyBrain ? 'Already Earned' : 'Discussions Needed',
      progressPercent: hasGalaxyBrain ? 100 : 0,
      currentValue: hasGalaxyBrain ? 1 : 0,
      targetValue: 2,
      detail: hasGalaxyBrain
        ? 'Verified! Galaxy Brain is active on your GitHub profile.'
        : 'Requires 2+ accepted answers in GitHub Discussions on public repositories.',
      actionRecommendation: 'Answer community questions in repositories with GitHub Discussions enabled.',
    },
    starstruck: {
      badgeId: 'starstruck',
      name: 'Starstruck',
      isUnlocked: hasStarstruck,
      statusLabel: hasStarstruck ? 'Already Earned' : '16 Stars Required',
      progressPercent: hasStarstruck ? 100 : 0,
      currentValue: hasStarstruck ? 16 : 0,
      targetValue: 16,
      detail: hasStarstruck
        ? 'Verified! Starstruck is active on your GitHub profile.'
        : 'Requires 16 stars across your public repositories.',
      actionRecommendation: 'Publish useful projects and showcase them to earn genuine community stars.',
    },
  };

  return {
    user,
    totalMergedPrs,
    totalIssuesClosed,
    quickdrawQualified: hasQuickdraw,
    quickdrawDurationSeconds,
    pullSharkTier,
    badgeEvaluations,
    recentMergedPrs,
    liveEarnedAchievements,
    scannedAt: new Date().toISOString(),
  };
}
