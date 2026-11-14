/**
 * GitGlow Pedagogical Curriculum & Deep Learning Modules
 * 
 * Every badge is structured as a comprehensive learning unit:
 * - The "Why": Industry context & why this concept matters in real engineering teams.
 * - The "What": Deep dive into the underlying Git/GitHub mechanisms.
 * - The "How": Step-by-step verified blueprint with exact terminal and web instructions.
 * - The "Gotchas": Edge cases where GitHub might fail to award the badge.
 * - The "Knowledge Check": Mini interactive quiz questions for students to test their understanding.
 */

export interface KnowledgeCheckQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BadgePedagogy {
  badgeId: string;
  badgeName: string;
  chapterNumber: string;
  badgeIcon: string;
  tagline: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  industryContext: {
    title: string;
    description: string;
    realWorldExample: string;
  };
  conceptsTaught: Array<{
    term: string;
    definition: string;
    proTip: string;
  }>;
  executionBlueprint: {
    prepStep: string;
    step1: {
      title: string;
      codeSnippet: string;
      cliExplanation: string;
      webAlternative: string;
    };
    step2: {
      title: string;
      codeSnippet: string;
      cliExplanation: string;
      webAlternative: string;
    };
    step3: {
      title: string;
      codeSnippet: string;
      cliExplanation: string;
      webAlternative: string;
    };
    webhookTriggerTime: string;
  };
  gotchas: string[];
  quiz: KnowledgeCheckQuestion[];
}

export const BADGE_CURRICULUM: Record<string, BadgePedagogy> = {
  quickdraw: {
    badgeId: 'quickdraw',
    badgeName: 'Quickdraw',
    chapterNumber: '01',
    badgeIcon: '/images/badges/quickdraw.png',
    tagline: 'Master issue lifecycles and fast incident triage.',
    estimatedTime: '120 Seconds',
    difficulty: 'Beginner',
    industryContext: {
      title: 'Incident Triage & Mean Time to Resolution (MTTR)',
      description: 'In engineering teams at companies like Google, Meta, or Stripe, fast issue triage is vital. When a bug report or production alert fires, engineers must acknowledge, inspect, and either resolve or route the ticket within tight Service Level Agreements (SLAs).',
      realWorldExample: 'A false-alarm alert triggers in a staging environment. The on-call engineer checks logs, determines it is transient, and closes the tracking incident within 3 minutes.',
    },
    conceptsTaught: [
      {
        term: 'Issue Lifecycle',
        definition: 'GitHub Issues serve as tickets to track work, bugs, or feature requests. An issue transitions from "Open" to "Closed" once the task is addressed.',
        proTip: 'Always link commits or PRs to issues using keywords like "Fixes #12" so closing the PR closes the issue automatically.',
      },
      {
        term: 'GitHub Webhook Telemetry',
        definition: 'Every time an issue state changes, GitHub dispatches an internal webhook event (`issues.closed`). GitHub Achievement ingestion workers calculate `closed_at - created_at`.',
        proTip: 'If that duration is less than 300 seconds (5 minutes), the Quickdraw trigger fires!',
      },
      {
        term: 'GitHub CLI (`gh`)',
        definition: 'The official command-line interface for GitHub that lets you manage issues, pull requests, and releases directly from your terminal.',
        proTip: 'Using `gh issue create` and `gh issue close` saves minutes over browser tab switching.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Make sure you have a personal public repository (or create a quick one called `gitglow-sandbox`).',
      step1: {
        title: 'Station 1: Open a Tracking Issue',
        codeSnippet: 'gh issue create --title "audit: verify system health" --body "Transient telemetry check for Quickdraw achievement."',
        cliExplanation: 'This fires the `issues.opened` webhook on GitHub servers and records the initial epoch timestamp.',
        webAlternative: 'Go to your repo on github.com → Issues tab → click "New issue" → Type title and click "Submit new issue".',
      },
      step2: {
        title: 'Station 2: Triage & Close Under 300 Seconds',
        codeSnippet: 'gh issue close 1 --comment "Triage completed in <120s. System verified."',
        cliExplanation: 'Closes the issue. GitHub verifies that (timestamp_close - timestamp_open) <= 300 seconds.',
        webAlternative: 'Immediately on the opened issue page, scroll to bottom, click "Close issue" button.',
      },
      step3: {
        title: 'Station 3: Webhook Verification Check',
        codeSnippet: 'gh api repos/{owner}/{repo}/issues/1 --jq "{number: .number, state: .state, duration_seconds: (.closed_at | fromdateiso8601) - (.created_at | fromdateiso8601)}"',
        cliExplanation: 'Confirms that the issue is officially registered as closed and the duration is within the 300-second window.',
        webAlternative: 'Refresh your repository on GitHub to see the purple "Closed" badge on Issue #1.',
      },
      webhookTriggerTime: 'GitHub batch cron indices profile achievements every 10–30 minutes.',
    },
    gotchas: [
      'Do NOT immediately delete the repository after closing the issue; GitHub needs the repo alive to index the event.',
      'The 5-minute timer starts the second the issue is submitted, so do not leave the tab open before closing.',
      'Closing PRs without merging also qualifies as long as it is within the 5-minute window.',
    ],
    quiz: [
      {
        id: 'qd-1',
        question: 'What is the maximum time window allowed between opening and closing an issue to qualify for Quickdraw?',
        options: ['1 minute', '5 minutes (300 seconds)', '15 minutes', '1 hour'],
        correctIndex: 1,
        explanation: 'GitHub officially requires the issue or PR to be closed within 300 seconds (5 minutes) of creation.',
      },
      {
        id: 'qd-2',
        question: 'Does the repository have to be public for GitHub achievements to display on your profile?',
        options: ['Yes, or private achievements must be explicitly enabled in profile settings', 'No, private repos are always publicly visible', 'Only organization repositories qualify'],
        correctIndex: 0,
        explanation: 'Achievements from public repositories show immediately; achievements from private repositories only show if you check "Include private contributions" in your GitHub profile settings.',
      },
    ],
  },

  'pull-shark': {
    badgeId: 'pull-shark',
    badgeName: 'Pull Shark',
    chapterNumber: '02',
    badgeIcon: '/images/badges/pull-shark.png',
    tagline: 'Master feature branching, commit staging, and pull request merging.',
    estimatedTime: '5 Minutes',
    difficulty: 'Beginner',
    industryContext: {
      title: 'The Pull Request: Heart of Collaborative Software',
      description: 'No engineer pushes directly to production. Instead, every new feature, bugfix, or optimization is developed in an isolated branch and proposed via a Pull Request (PR). Code reviews, automated CI tests, and discussions happen here.',
      realWorldExample: 'A junior frontend engineer adds a dark mode toggle on branch `feat/dark-mode`. A senior engineer reviews the CSS, CI tests pass, and it gets merged into `main`.',
    },
    conceptsTaught: [
      {
        term: 'Feature Branch Isolation',
        definition: 'Branching allows you to diverge from the main line of development and continue work without corrupting the main codebase.',
        proTip: 'Use standard branch naming: `feat/...`, `fix/...`, or `chore/...`.',
      },
      {
        term: 'Atomic Commits',
        definition: 'A commit is a snapshot of your staged changes at a point in time. An atomic commit changes one logical thing with a descriptive commit message.',
        proTip: 'Use conventional commits: `type(scope): concise description`.',
      },
      {
        term: 'Pull Request Merging',
        definition: 'A PR is not just Git code—it is an official GitHub event that merges one branch into another after approval and checks.',
        proTip: 'GitHub requires at least 2 merged PRs to award the base Pull Shark badge!',
      },
    ],
    executionBlueprint: {
      prepStep: 'Navigate to your local repository clone or fork the GitGlow sandbox.',
      step1: {
        title: 'Station 1: Create a Feature Branch',
        codeSnippet: 'git switch -c feat/contributor-milestone-1',
        cliExplanation: 'Creates and immediately checks out a new branch isolated from your main branch.',
        webAlternative: 'On GitHub, click the branch dropdown ("main"), type `feat/contributor-milestone-1` and click "Create branch".',
      },
      step2: {
        title: 'Station 2: Stage & Commit Verified Work',
        codeSnippet: 'echo "Contribution verification: $(date)" >> milestone.txt\ngit add milestone.txt\ngit commit -m "feat(profile): verified milestone contribution card"\ngit push -u origin feat/contributor-milestone-1',
        cliExplanation: 'Stages file changes, creates a signed commit snapshot, and publishes the branch to GitHub remote.',
        webAlternative: 'On GitHub under the new branch, click "Add file" → "Create new file", name it `milestone.txt`, and click "Commit changes".',
      },
      step3: {
        title: 'Station 3: Open PR & Merge into Default Branch',
        codeSnippet: 'gh pr create --title "feat: milestone 1 verified" --body "PR for Pull Shark qualification." --base main\ngh pr merge --auto --merge',
        cliExplanation: 'Opens the pull request targeting main, and triggers GitHub auto-merge as soon as checks pass.',
        webAlternative: 'Click the green "Compare & pull request" banner on GitHub, click "Create pull request", then click the green "Merge pull request" button.',
      },
      webhookTriggerTime: 'Requires 2 merged PRs. Tiers upgrade at 16 (x2), 128 (x3), and 1024 (x4) merged PRs.',
    },
    gotchas: [
      'The PR must be MERGED into the default branch (usually `main`), not merely closed or rejected.',
      'Draft PRs do not count until they are marked "Ready for review" and officially merged.',
      'Repeat the flow twice (2 distinct merged PRs) to trigger the base Pull Shark achievement!',
    ],
    quiz: [
      {
        id: 'ps-1',
        question: 'How many merged pull requests are needed to unlock the base Pull Shark achievement?',
        options: ['1 merged PR', '2 merged PRs', '5 merged PRs', '10 merged PRs'],
        correctIndex: 1,
        explanation: 'GitHub officially awards the Pull Shark badge after at least 2 pull requests are successfully merged.',
      },
      {
        id: 'ps-2',
        question: 'What happens if you open a PR and close it without clicking "Merge"?',
        options: ['It counts as half a PR', 'It does NOT count towards Pull Shark', 'It immediately gives you Pull Shark'],
        correctIndex: 1,
        explanation: 'Only MERGED pull requests count toward Pull Shark. Closed/rejected PRs do not qualify.',
      },
    ],
  },

  'pair-extraordinaire': {
    badgeId: 'pair-extraordinaire',
    badgeName: 'Pair Extraordinaire',
    chapterNumber: '03',
    badgeIcon: '/images/badges/pair-extraordinaire.png',
    tagline: 'Master open-source collaboration using RFC-standard Git trailers.',
    estimatedTime: '8 Minutes',
    difficulty: 'Intermediate',
    industryContext: {
      title: 'Pair Programming & Co-Authoring Standards',
      description: 'In modern engineering cultures (like ThoughtWorks or Extreme Programming), pair programming is standard. Two developers write code together on one screen. Git provides a standardized RFC header so both developers get official contribution credit.',
      realWorldExample: 'A backend developer and a security engineer sit together to implement an OAuth2 PKCE flow. Both their names appear on the commit history on GitHub.',
    },
    conceptsTaught: [
      {
        term: 'Git Commit Trailers',
        definition: 'Key-value pairs placed at the bottom of a commit message following RFC 822 email header conventions.',
        proTip: 'The exact trailer name recognized by GitHub is `Co-authored-by: Full Name <username@email.com>`.',
      },
      {
        term: 'Dual Profile Attribution',
        definition: 'When GitHub indexes a commit with a valid co-author trailer, both GitHub accounts receive green contribution graph squares and badge progress.',
        proTip: 'The email used in the trailer must match an email verified on the collaborator’s GitHub account.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Get the GitHub username and public email of a friend, or use GitGlow Bot email (`pair-bot@gitglow.dev`).',
      step1: {
        title: 'Station 1: Prepare Feature Branch',
        codeSnippet: 'git switch -c feat/pair-programming-session',
        cliExplanation: 'Isolates the pairing sprint on a dedicated branch.',
        webAlternative: 'Create a new branch `feat/pair-programming-session` on github.com.',
      },
      step2: {
        title: 'Station 2: Write Commit with Co-Authored Trailer',
        codeSnippet: `git commit --allow-empty -m "feat(collab): pair programming session milestone

Co-authored-by: GitGlow Peer <pair-bot@gitglow.dev>"`,
        cliExplanation: 'Notice the BLANK line between the commit message and the trailer. Without that blank line, git treats it as plain text instead of a trailer!',
        webAlternative: 'When committing in GitHub web editor, paste the `Co-authored-by:` line into the description field.',
      },
      step3: {
        title: 'Station 3: Open and Merge the Co-Authored PR',
        codeSnippet: 'git push -u origin feat/pair-programming-session\ngh pr create --title "feat: pair programming sprint" --body "Co-authored commit milestone."\ngh pr merge --auto --merge',
        cliExplanation: 'Merges the commit into main. GitHub server processes the trailer header and attributes both accounts.',
        webAlternative: 'Open and merge the PR via the GitHub web interface.',
      },
      webhookTriggerTime: 'Awards Pair Extraordinaire to both accounts upon PR merge.',
    },
    gotchas: [
      'CRITICAL: There MUST be an empty line directly preceding "Co-authored-by:". If there is no blank line, GitHub cannot parse it.',
      'The email inside the angle brackets `<email>` must be a valid email format.',
      'The PR must be merged into the default branch.',
    ],
    quiz: [
      {
        id: 'pe-1',
        question: 'What is the required format for a GitHub co-author commit header?',
        options: [
          'Co-authored-by: Name <email@example.com> with a preceding blank line',
          '@coauthor Name',
          'Shared-with: Name',
          'Just tagging them in the PR comment'
        ],
        correctIndex: 0,
        explanation: 'GitHub follows the RFC Git trailer standard: "Co-authored-by: Name <email@example.com>" preceded by an empty line.',
      },
    ],
  },

  yolo: {
    badgeId: 'yolo',
    badgeName: 'YOLO',
    chapterNumber: '04',
    badgeIcon: '/images/badges/yolo.png',
    tagline: 'Understand branch protection rules and emergency administrative merges.',
    estimatedTime: '3 Minutes',
    difficulty: 'Intermediate',
    industryContext: {
      title: 'Branch Protections & Break-Glass Merges',
      description: 'Production branches are usually protected: they require 1–2 code reviews and passing tests. But in high-severity P0 incidents (e.g. data leak or site down), engineering leaders use "Break-Glass" admin bypass to merge emergency fixes without waiting.',
      realWorldExample: 'A critical vulnerability is identified in an auth middleware at midnight. The VP of Engineering pushes an emergency hotfix directly without waiting for a scheduled review.',
    },
    conceptsTaught: [
      {
        term: 'Branch Protection Rules',
        definition: 'GitHub repository rulesets that prevent accidental deletions, force-pushes, and require PR reviews before merging.',
        proTip: 'Every open-source repository should have branch protections enabled on `main`.',
      },
      {
        term: 'Admin Bypass / Direct Merge',
        definition: 'Merging a pull request without requesting or submitting any code review.',
        proTip: 'GitHub triggers the YOLO badge when a PR is merged without code review on a repository with collaborators.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Ensure your test repository has at least 1 collaborator or is set up for PR workflows.',
      step1: {
        title: 'Station 1: Create Hotfix Branch',
        codeSnippet: 'git switch -c yolo/direct-merge-hotfix',
        cliExplanation: 'Prepares an isolated emergency branch.',
        webAlternative: 'Create branch `yolo/direct-merge-hotfix` on github.com.',
      },
      step2: {
        title: 'Station 2: Stage Emergency Patch',
        codeSnippet: 'echo "Hotfix patch: $(date)" >> patch.log\ngit add patch.log\ngit commit -m "fix(hotfix): direct emergency patch"\ngit push -u origin yolo/direct-merge-hotfix',
        cliExplanation: 'Pushes the patch commit to GitHub.',
        webAlternative: 'Add or modify a file in the web editor and commit to the branch.',
      },
      step3: {
        title: 'Station 3: Open PR & Merge Without Review',
        codeSnippet: 'gh pr create --title "fix: emergency bypass" --body "YOLO qualification run."\ngh pr merge --admin --merge',
        cliExplanation: 'Merges directly without requesting reviewers or waiting for an approving review.',
        webAlternative: 'Open the PR and immediately click "Merge pull request" without adding any reviewers.',
      },
      webhookTriggerTime: 'GitHub records PR merged with zero review approvals.',
    },
    gotchas: [
      'Do NOT request any reviewers in the PR. If a reviewer is assigned or approves, YOLO will not fire.',
      'Must be done via a Pull Request (a direct push to main via `git push origin main` does NOT trigger YOLO; it must be a PR merge).',
    ],
    quiz: [
      {
        id: 'yo-1',
        question: 'Does pushing directly to main via `git push origin main` give you the YOLO badge?',
        options: ['No, it MUST be a Pull Request merged without review', 'Yes, any push to main works', 'Only if done at midnight'],
        correctIndex: 0,
        explanation: 'YOLO specifically tracks Pull Requests that are merged without code review, not raw git pushes.',
      },
    ],
  },
};

