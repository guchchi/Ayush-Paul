/**
 * GitGlow GitHub API Service & Badge Qualification Logic
 * Completely client-side & zero-OAuth / personal token enabled (if provided)
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
  starredCount: number;
  hasDiscussionsAnswers: boolean;
  hasCoAuthoredCommits: boolean;
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
 * Public GitHub REST API Fetcher with graceful rate-limit handling
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
      throw new Error(`GitHub user "${cleanHandle}" not found.`);
    } else if (res.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
    }
    throw new Error(`Failed to fetch user from GitHub (Status: ${res.status})`);
  }

  return res.json();
}

/**
 * Analyzes real GitHub activity for a given user handle
 */
export async function analyzeGitHubProfile(username: string): Promise<UserScanAnalysis> {
  const cleanHandle = username.trim().replace(/^@/, '');
  const user = await fetchGitHubProfile(cleanHandle);

  // 1. Fetch Merged PRs count & latest PRs
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

  // 2. Fetch Closed Issues count (helps evaluate Quickdraw potential)
  let totalIssuesClosed = 0;
  try {
    const issueRes = await fetch(
      `https://api.github.com/search/issues?q=author:${encodeURIComponent(cleanHandle)}+type:issue+is:closed&per_page=1`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (issueRes.ok) {
      const issueData = await issueRes.json();
      totalIssuesClosed = issueData.total_count || 0;
    }
  } catch (err) {
    console.warn('Issue search error:', err);
  }

  // 3. Evaluate Badges based on real API metrics + heuristics
  const badgeEvaluations: Record<string, BadgeStatusEvaluation> = {
    'pull-shark': {
      badgeId: 'pull-shark',
      name: 'Pull Shark',
      isUnlocked: totalMergedPrs >= 2,
      statusLabel: totalMergedPrs >= 2 ? 'Unlocked' : `${totalMergedPrs}/2 Merged PRs`,
      progressPercent: Math.min(100, Math.round((totalMergedPrs / 2) * 100)),
      currentValue: totalMergedPrs,
      targetValue: 2,
      detail: totalMergedPrs >= 2 
        ? `Qualified! You have ${totalMergedPrs} merged PRs on GitHub.`
        : `Needs ${2 - totalMergedPrs} more merged PR to unlock.`,
      actionRecommendation: totalMergedPrs >= 2
        ? 'Push towards 16 PRs to reach Tier 2 Bronze Pull Shark!'
        : 'Run the Pull Shark 1-click recipe on your test repo or GitGlow Community Sandbox.',
    },
    quickdraw: {
      badgeId: 'quickdraw',
      name: 'Quickdraw',
      isUnlocked: totalIssuesClosed > 0, // Heuristic: user has closed issues
      statusLabel: totalIssuesClosed > 0 ? 'Ready / Likely Unlocked' : 'Pending Test',
      progressPercent: totalIssuesClosed > 0 ? 100 : 0,
      currentValue: totalIssuesClosed,
      targetValue: 1,
      detail: totalIssuesClosed > 0
        ? `Found ${totalIssuesClosed} closed issue(s) under your account.`
        : 'No closed issues detected. Execute the 120s Quickdraw loop to claim.',
      actionRecommendation: 'Open a quick tracking issue and close it within 5 minutes to trigger the GitHub webhook.',
    },
    yolo: {
      badgeId: 'yolo',
      name: 'YOLO',
      isUnlocked: totalMergedPrs > 0 && user.public_repos > 0,
      statusLabel: totalMergedPrs > 0 ? 'Achievable / In Progress' : 'Pending 1st PR',
      progressPercent: totalMergedPrs > 0 ? 100 : 30,
      currentValue: totalMergedPrs > 0 ? 1 : 0,
      targetValue: 1,
      detail: 'Merge a pull request directly without code review on any public repo.',
      actionRecommendation: 'Use gh pr merge --admin or direct merge on your own repository.',
    },
    'pair-extraordinaire': {
      badgeId: 'pair-extraordinaire',
      name: 'Pair Extraordinaire',
      isUnlocked: false,
      statusLabel: 'Co-Authoring Required',
      progressPercent: 20,
      currentValue: 0,
      targetValue: 1,
      detail: 'Requires an official Git trailer commit: "Co-authored-by: Name <email>" in a merged PR.',
      actionRecommendation: 'Run the Pair Extraordinaire recipe with a collaborator or the GitGlow co-author bot handle.',
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
      actionRecommendation: 'Answer technical questions in community discussions or open discussion repositories.',
    },
    starstruck: {
      badgeId: 'starstruck',
      name: 'Starstruck',
      isUnlocked: user.public_repos >= 1,
      statusLabel: user.public_repos >= 1 ? 'Repo Ready' : 'Needs Public Repo',
      progressPercent: Math.min(100, Math.round((user.public_repos / 1) * 50)),
      currentValue: user.public_repos,
      targetValue: 16,
      detail: 'Requires 16 community stars on your repositories.',
      actionRecommendation: 'Publish your tool or showcase repository with proper tags and README badges.',
    },
  };

  return {
    user,
    totalMergedPrs,
    totalIssuesClosed,
    starredCount: 0,
    hasDiscussionsAnswers: false,
    hasCoAuthoredCommits: false,
    badgeEvaluations,
    recentMergedPrs,
    scannedAt: new Date().toISOString(),
  };
}

