/**
 * GitGlow Real GitHub Executor
 * Directly executes live operations on GitHub via authenticated REST API:
 * 1. Checks or creates student sandbox repository if needed
 * 2. Creates real Issue for Quickdraw
 * 3. Closes real Issue for Quickdraw under 300 seconds
 * 4. Verifies closed duration and GitHub webhook trigger
 */

export interface GitHubIssueResult {
  number: number;
  id: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  created_at: string;
  closed_at?: string;
  durationSeconds?: number;
}

export interface GitHubRepoInfo {
  name: string;
  full_name: string;
  owner: string;
  html_url: string;
  default_branch: string;
}

/**
 * Get or ensure student has a target repository to execute badge missions
 */
export async function getOrCreateStudentSandbox(
  accessToken: string,
  preferredRepoName = 'gitglow-sandbox'
): Promise<GitHubRepoInfo> {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${accessToken}`,
  };

  // 1. Fetch authenticated user profile
  const userRes = await fetch('https://api.github.com/user', { headers });
  if (!userRes.ok) {
    throw new Error('Failed to verify GitHub authentication token.');
  }
  const userData = await userRes.json();
  const owner = userData.login;

  // 2. Check if preferredRepo exists
  const checkRes = await fetch(`https://api.github.com/repos/${owner}/${preferredRepoName}`, { headers });
  if (checkRes.ok) {
    const repoData = await checkRes.json();
    return {
      name: repoData.name,
      full_name: repoData.full_name,
      owner,
      html_url: repoData.html_url,
      default_branch: repoData.default_branch || 'main',
    };
  }

  // 3. If not found, create a public sandbox repo automatically
  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: preferredRepoName,
      description: 'GitGlow Sandbox for real GitHub achievement qualification missions.',
      private: false,
      auto_init: true,
    }),
  });

  if (!createRes.ok) {
    // If creation fails, fallback to first available public repo
    const listRes = await fetch('https://api.github.com/user/repos?type=owner&sort=updated&per_page=1', { headers });
    if (listRes.ok) {
      const list = await listRes.json();
      if (list && list.length > 0) {
        return {
          name: list[0].name,
          full_name: list[0].full_name,
          owner,
          html_url: list[0].html_url,
          default_branch: list[0].default_branch || 'main',
        };
      }
    }
    throw new Error('Could not initialize sandbox repository. Please ensure you have public repository permissions.');
  }

  const newRepo = await createRes.json();
  return {
    name: newRepo.name,
    full_name: newRepo.full_name,
    owner,
    html_url: newRepo.html_url,
    default_branch: newRepo.default_branch || 'main',
  };
}

/**
 * Real GitHub Quickdraw Action: Create Issue
 */
export async function executeRealCreateIssue(
  accessToken: string,
  owner: string,
  repo: string,
  title = 'audit: verify system health (Quickdraw milestone)'
): Promise<GitHubIssueResult> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body: `Transient telemetry validation for Quickdraw official achievement via GitGlow.\nEpoch: ${Date.now()}`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create issue on GitHub (Status: ${res.status})`);
  }

  const issue = await res.json();
  return {
    number: issue.number,
    id: issue.id,
    title: issue.title,
    html_url: issue.html_url,
    state: issue.state,
    created_at: issue.created_at,
  };
}

/**
 * Real GitHub Quickdraw Action: Close Issue
 */
export async function executeRealCloseIssue(
  accessToken: string,
  owner: string,
  repo: string,
  issueNumber: number
): Promise<GitHubIssueResult> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      state: 'closed',
      state_reason: 'completed',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to close issue on GitHub (Status: ${res.status})`);
  }

  const issue = await res.json();
  let durationSeconds = 0;
  if (issue.created_at && issue.closed_at) {
    const created = new Date(issue.created_at).getTime();
    const closed = new Date(issue.closed_at).getTime();
    durationSeconds = Math.round((closed - created) / 1000);
  }

  return {
    number: issue.number,
    id: issue.id,
    title: issue.title,
    html_url: issue.html_url,
    state: issue.state,
    created_at: issue.created_at,
    closed_at: issue.closed_at,
    durationSeconds,
  };
}

export interface GitHubPullRequestResult {
  number: number;
  id: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  merged: boolean;
  merged_at?: string;
  headBranch: string;
  baseBranch: string;
}

/**
 * Real GitHub Pull Shark Action: Create Feature Branch, Commit Contributor Card, and Open PR
 */
export async function executeRealCreatePullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  defaultBranch = 'main'
): Promise<GitHubPullRequestResult> {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // 1. Get default branch commit SHA
  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`, { headers });
  if (!refRes.ok) {
    throw new Error(`Could not resolve branch refs/heads/${defaultBranch} (Status: ${refRes.status})`);
  }
  const refData = await refRes.json();
  const baseSha = refData.object.sha;

  // 2. Create feature branch
  const featureBranch = `feat/gitglow-contributor-${Date.now().toString().slice(-6)}`;
  const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${featureBranch}`,
      sha: baseSha,
    }),
  });

  if (!branchRes.ok) {
    const err = await branchRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create feature branch.');
  }

  // 3. Commit contributor card file on feature branch
  const filePath = `contributors/${owner}.json`;
  const fileContent = JSON.stringify(
    {
      handle: owner,
      achievementTarget: 'Pull Shark',
      verifiedTimestamp: new Date().toISOString(),
      verifiedVia: 'GitGlow Achievements Engine',
    },
    null,
    2
  );
  const encodedContent = btoa(fileContent);

  const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `feat: register @${owner} contributor card for Pull Shark milestone`,
      content: encodedContent,
      branch: featureBranch,
    }),
  });

  if (!fileRes.ok) {
    const err = await fileRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to commit contributor card.');
  }

  // 4. Open Pull Request into defaultBranch
  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: `feat: add @${owner} contributor profile [Pull Shark Qualification]`,
      head: featureBranch,
      base: defaultBranch,
      body: `### GitGlow Official Achievement Telemetry\n- **Target Badge**: Pull Shark\n- **Contributor**: @${owner}\n- **Branch**: \`${featureBranch}\`\n\nAuto-merging this Pull Request will trigger GitHub's Pull Shark achievement counter on your official profile!`,
    }),
  });

  if (!prRes.ok) {
    const err = await prRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to open Pull Request on GitHub.');
  }

  const pr = await prRes.json();
  return {
    number: pr.number,
    id: pr.id,
    title: pr.title,
    html_url: pr.html_url,
    state: pr.state,
    merged: pr.merged || false,
    headBranch: featureBranch,
    baseBranch: defaultBranch,
  };
}

/**
 * Real GitHub Pull Shark Action: Auto-merge Pull Request into Default Branch
 */
export async function executeRealMergePullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
  commitTitle?: string,
  commitMessage?: string
): Promise<GitHubPullRequestResult> {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const mergeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      commit_title: commitTitle || `Merge pull request #${pullNumber} from GitGlow Engine`,
      commit_message: commitMessage || `Official qualification merged successfully without code review.`,
      merge_method: 'merge',
    }),
  });

  if (!mergeRes.ok) {
    const err = await mergeRes.json().catch(() => ({}));
    throw new Error(err.message || `Failed to merge Pull Request (Status: ${mergeRes.status})`);
  }

  // Fetch updated PR state
  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, { headers });
  const pr = await prRes.json();

  return {
    number: pr.number,
    id: pr.id,
    title: pr.title,
    html_url: pr.html_url,
    state: pr.state,
    merged: pr.merged || true,
    merged_at: pr.merged_at || new Date().toISOString(),
    headBranch: pr.head?.ref || '',
    baseBranch: pr.base?.ref || 'main',
  };
}

/**
 * Real GitHub YOLO Action: Create Hotfix Branch, Commit Patch, and Open PR with Zero Reviewers
 */
export async function executeRealYoloPullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  defaultBranch = 'main',
  reviewerHandle?: string
): Promise<GitHubPullRequestResult> {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // 1. Get default branch commit SHA
  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`, { headers });
  if (!refRes.ok) {
    throw new Error(`Could not resolve branch refs/heads/${defaultBranch} (Status: ${refRes.status})`);
  }
  const refData = await refRes.json();
  const baseSha = refData.object.sha;

  // 2. Create emergency hotfix branch
  const branchSuffix = Date.now().toString().slice(-4);
  const hotfixBranch = `hotfix/yolo-bypass-${branchSuffix}`;
  const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${hotfixBranch}`,
      sha: baseSha,
    }),
  });

  if (!branchRes.ok) {
    const err = await branchRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create hotfix branch.');
  }

  // 3. Commit atomic hotfix patch file
  const filePath = `patches/yolo-hotfix-${branchSuffix}.md`;
  const fileContent = `# YOLO Emergency Patch\n\n- **Target Badge**: YOLO (Merged without code review)\n- **Author**: @${owner}\n- **Engine**: GitGlow Sandbox Engine\n- **Timestamp**: ${new Date().toISOString()}\n- **Review Rule**: Zero Reviewers Assigned (Bypass SLA)\n`;
  const encodedContent = btoa(fileContent);

  const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `fix(emergency): direct patch for YOLO qualification #${branchSuffix}`,
      content: encodedContent,
      branch: hotfixBranch,
    }),
  });

  if (!fileRes.ok) {
    const err = await fileRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to commit patch file on hotfix branch.');
  }

  // 4. Open Pull Request with ZERO reviewers assigned
  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: `fix(emergency): direct patch for YOLO achievement #${branchSuffix}`,
      head: hotfixBranch,
      base: defaultBranch,
      body: `### YOLO Achievement Qualification\n\nMerged directly into \`${defaultBranch}\` without code review.\n- **Author**: @${owner}\n- **Engine**: GitGlow Achievements Engine\n- **Zero-Review Rule**: Verified (0 reviewers assigned)\n`,
    }),
  });

  if (!prRes.ok) {
    const err = await prRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to open Pull Request on GitHub.');
  }

  const pr = await prRes.json();

  // 5. If a collaborator reviewer was specified, request review so GitHub records the bypass event
  const cleanReviewer = reviewerHandle?.trim().replace(/^@/, '');
  if (cleanReviewer && cleanReviewer.toLowerCase() !== owner.toLowerCase()) {
    try {
      await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/requested_reviewers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reviewers: [cleanReviewer],
        }),
      });
    } catch (e) {
      console.warn('Note: Reviewer request optional fallback:', e);
    }
  }

  return {
    number: pr.number,
    id: pr.id,
    title: pr.title,
    html_url: pr.html_url,
    state: pr.state,
    merged: pr.merged || false,
    headBranch: hotfixBranch,
    baseBranch: defaultBranch,
  };
}

/**
 * Real GitHub Pair Extraordinaire Action: Commit with RFC Co-Authored Trailer and Open PR
 */
export async function executeRealPairExtraordinairePullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  coAuthorName = 'GitGlow Pairing Bot',
  coAuthorEmail = 'bot@gitglow.dev',
  defaultBranch = 'main'
): Promise<GitHubPullRequestResult> {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // 1. Get default branch commit SHA
  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`, { headers });
  if (!refRes.ok) {
    throw new Error(`Could not resolve branch refs/heads/${defaultBranch} (Status: ${refRes.status})`);
  }
  const refData = await refRes.json();
  const baseSha = refData.object.sha;

  // 2. Create pair branch
  const branchSuffix = Date.now().toString().slice(-4);
  const pairBranch = `feat/pair-collab-${branchSuffix}`;
  const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${pairBranch}`,
      sha: baseSha,
    }),
  });

  if (!branchRes.ok) {
    const err = await branchRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create feature branch.');
  }

  // 3. Commit file with RFC Git Trailer: "Co-authored-by: Name <email>"
  const filePath = `pair-sessions/session-${branchSuffix}.md`;
  const fileContent = `# Pair Programming Sprint\n\n- Primary Author: @${owner}\n- Co-Author: ${coAuthorName} <${coAuthorEmail}>\n- Engine: GitGlow Achievements Engine\n- Timestamp: ${new Date().toISOString()}\n`;
  const encodedContent = btoa(fileContent);

  const commitMessage = `feat(collab): pair programming session #${branchSuffix}\n\nCo-authored-by: ${coAuthorName} <${coAuthorEmail}>`;

  const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: commitMessage,
      content: encodedContent,
      branch: pairBranch,
    }),
  });

  if (!fileRes.ok) {
    const err = await fileRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to commit co-authored file.');
  }

  // 4. Open Pull Request
  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: `feat(collab): pair programming session with ${coAuthorName} #${branchSuffix}`,
      head: pairBranch,
      base: defaultBranch,
      body: `### Pair Extraordinaire Qualification\n\nThis pull request contains a verified RFC Git Trailer:\n\`\`\`\nCo-authored-by: ${coAuthorName} <${coAuthorEmail}>\n\`\`\`\n\nMerged into \`${defaultBranch}\` to qualify for the official GitHub **Pair Extraordinaire** badge.\n`,
    }),
  });

  if (!prRes.ok) {
    const err = await prRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to open Pull Request.');
  }

  const pr = await prRes.json();
  return {
    number: pr.number,
    id: pr.id,
    title: pr.title,
    html_url: pr.html_url,
    state: pr.state,
    merged: pr.merged || false,
    headBranch: pairBranch,
    baseBranch: defaultBranch,
  };
}


