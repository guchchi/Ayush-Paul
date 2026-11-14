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

  // 4. Construct Precise Evaluation Map
  const badgeEvaluations: Record<string, BadgeStatusEvaluation> = {
    quickdraw: {
      badgeId: 'quickdraw',
      name: 'Quickdraw',
      isUnlocked: quickdrawQualified,
      statusLabel: quickdrawQualified ? 'Already Earned' : 'Not Yet Earned',
      progressPercent: quickdrawQualified ? 100 : 0,
      currentValue: quickdrawQualified ? 1 : 0,
      targetValue: 1,
      detail: quickdrawQualified
        ? `Verified! Found a closed issue resolved in ${quickdrawDurationSeconds}s (<300s window).`
        : totalIssuesClosed > 0
        ? `Found ${totalIssuesClosed} closed issue(s), but none closed within the strict 5-minute (300s) window.`
        : 'No closed issues detected under your account.',
      actionRecommendation: quickdrawQualified
        ? 'Badge already awarded on your profile! You can still practice the fast triage workflow.'
        : 'Follow the 120-second Quickdraw blueprint: open an issue and close it in under 5 minutes.',
    },
    'pull-shark': {
      badgeId: 'pull-shark',
      name: 'Pull Shark',
      isUnlocked: totalMergedPrs >= 2,
      badgeLevel: pullSharkTier !== 'None' ? pullSharkTier : undefined,
      statusLabel: totalMergedPrs >= 2 ? `Earned (${pullSharkTier})` : `${totalMergedPrs}/2 Merged PRs`,
      progressPercent: Math.min(100, Math.round((totalMergedPrs / 2) * 100)),
      currentValue: totalMergedPrs,
      targetValue: 2,
      detail: totalMergedPrs >= 2
        ? `Qualified! You have ${totalMergedPrs} merged pull requests on GitHub (${pullSharkTier}).`
        : `Needs ${2 - totalMergedPrs} more merged PR into default branch to unlock.`,
      actionRecommendation: totalMergedPrs >= 2
        ? 'Aim for 16 merged PRs to unlock the Bronze (x2) tier badge border!'
        : 'Open and merge 2 PRs using our verified sandbox workflow or personal repo.',
    },
    yolo: {
      badgeId: 'yolo',
      name: 'YOLO',
      isUnlocked: totalMergedPrs > 0, // Heuristic if user has direct merges
      statusLabel: totalMergedPrs > 0 ? 'Achievable' : 'Needs 1st PR',
      progressPercent: totalMergedPrs > 0 ? 100 : 25,
      currentValue: totalMergedPrs > 0 ? 1 : 0,
      targetValue: 1,
      detail: 'Merge a pull request without code review on a collaborative repo.',
      actionRecommendation: 'Merge a PR directly on your repo without assigning reviewers.',
    },
    'pair-extraordinaire': {
      badgeId: 'pair-extraordinaire',
      name: 'Pair Extraordinaire',
      isUnlocked: false,
      statusLabel: 'Co-Authoring Required',
      progressPercent: 15,
      currentValue: 0,
      targetValue: 1,
      detail: 'Requires an RFC Git trailer: "Co-authored-by: Name <email>" in a merged commit.',
      actionRecommendation: 'Follow the Pair Extraordinaire blueprint to craft an authentic co-authored commit.',
    },
    'galaxy-brain': {
      badgeId: 'galaxy-brain',
      name: 'Galaxy Brain',
      isUnlocked: false,
      statusLabel: 'Discussions Needed',
      progressPercent: 10,
      currentValue: 0,
      targetValue: 2,
      detail: 'Requires 2+ accepted answers in GitHub Discussions on public repositories.',
      actionRecommendation: 'Answer community questions in repositories with GitHub Discussions enabled.',
    },
    starstruck: {
      badgeId: 'starstruck',
      name: 'Starstruck',
      isUnlocked: user.public_repos >= 1,
      statusLabel: user.public_repos >= 1 ? 'Repository Ready' : 'Needs Public Repo',
      progressPercent: Math.min(100, Math.round((user.public_repos / 1) * 50)),
      currentValue: user.public_repos,
      targetValue: 16,
      detail: 'Requires 16 stars on your public repositories.',
      actionRecommendation: 'Publish useful projects and showcase them to earn genuine community stars.',
    },
  };

  return {
    user,
    totalMergedPrs,
    totalIssuesClosed,
    quickdrawQualified,
    quickdrawDurationSeconds,
    pullSharkTier,
    badgeEvaluations,
    recentMergedPrs,
    scannedAt: new Date().toISOString(),
  };
}
