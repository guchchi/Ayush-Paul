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
  'galaxy-brain': {
    badgeId: 'galaxy-brain',
    badgeName: 'Galaxy Brain',
    chapterNumber: '05',
    badgeIcon: '/images/badges/galaxy-brain.png',
    tagline: 'Become a respected open-source problem solver via GitHub Discussions.',
    estimatedTime: '15 Minutes',
    difficulty: 'Intermediate',
    industryContext: {
      title: 'Community Q&A and Developer Knowledge Bases',
      description: 'GitHub Discussions serves as the StackOverflow for specific open source repositories. Answering questions and having your solution marked as the "Accepted Answer" creates long-term institutional knowledge for developer tools.',
      realWorldExample: 'A developer on Next.js or Tailwind CSS explains how to configure dynamic routing with edge middleware. The maintainer marks it as the Accepted Answer, helping thousands of future engineers.',
    },
    conceptsTaught: [
      {
        term: 'Q&A Discussion Category',
        definition: 'Special category type in GitHub Discussions that permits mark-as-answer resolution flags.',
        proTip: 'Only discussions opened under a category with the "Q&A" format can receive the official green Accepted Answer badge.',
      },
      {
        term: 'Accepted Answer Checkmark',
        definition: 'A verified resolution marker placed on a comment by the discussion author or repository maintainer.',
        proTip: 'You need 2 accepted answers across public repositories to qualify for Galaxy Brain Tier 1.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Ensure you have a public repository with Discussions enabled in Settings > Features > Discussions.',
      step1: {
        title: 'Station 1: Open a Q&A Discussion',
        codeSnippet: 'gh api graphql -f query=\'mutation { createDiscussion(...) }\'',
        cliExplanation: 'Or visit the repository Discussions tab in your browser and click "New discussion" under Q&A.',
        webAlternative: 'Go to github.com/<user>/<repo>/discussions and select Q&A format.',
      },
      step2: {
        title: 'Station 2: Post the Technical Solution',
        codeSnippet: 'gh api graphql -f query=\'mutation { addDiscussionComment(...) }\'',
        cliExplanation: 'Submit a clear, helpful code snippet or step-by-step resolution to the posted problem.',
        webAlternative: 'Post your answer in the comment reply box under the discussion.',
      },
      step3: {
        title: 'Station 3: Mark as Accepted Answer',
        codeSnippet: 'gh api graphql -f query=\'mutation { markDiscussionCommentAsAnswer(...) }\'',
        cliExplanation: 'The repository maintainer or original author clicks the green checkmark "Mark as answer".',
        webAlternative: 'Click "Mark as answer" on the top right of the comment.',
      },
      webhookTriggerTime: 'GitHub increments the Galaxy Brain counter immediately upon answer selection.',
    },
    gotchas: [
      'The discussion category MUST be configured as "Q&A". General discussions or Announcements do not support accepted answers.',
      'You cannot mark your own comment as answer if the repository has disabled self-resolutions.',
    ],
    quiz: [
      {
        id: 'gb-1',
        question: 'Which discussion category format supports accepted answers for Galaxy Brain?',
        options: ['Q&A Category', 'Announcements Category', 'General Chat', 'Ideas Category'],
        correctIndex: 0,
        explanation: 'Only discussions configured with the Q&A format have the green "Mark as answer" verification feature.',
      },
    ],
  },
  starstruck: {
    badgeId: 'starstruck',
    badgeName: 'Starstruck',
    chapterNumber: '06',
    badgeIcon: '/images/badges/starstruck.png',
    tagline: 'Build developer momentum and earn 16 genuine community stars.',
    estimatedTime: 'Ongoing Project',
    difficulty: 'Intermediate',
    industryContext: {
      title: 'Social Proof, Developer Signals & Open Source Discovery',
      description: 'GitHub stars represent bookmarks and community endorsements. High-star repositories achieve organic discovery on GitHub Trending, Google Search, and "Awesome" lists, establishing credibility for creators and projects.',
      realWorldExample: 'A software engineer open-sources an elegant CLI tool or UI component library. Community developers star the repo to save it for their tech stack, signaling adoption to potential employers.',
    },
    conceptsTaught: [
      {
        term: 'Open-Source Social Proof',
        definition: 'Public recognition by fellow engineers who find value, utility, or architectural inspiration in your codebase.',
        proTip: '16 stars on your public repositories unlocks Tier 1 of the official Starstruck achievement.',
      },
      {
        term: 'High-Conversion README Architecture',
        definition: 'Structuring project documentation with immediate visual hooks, installation badges, quickstart copy-paste commands, and animated demos.',
        proTip: 'Repositories with an interactive demo or GIF achieve 4x higher star retention than text-only readmes.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Create a clean, well-architected public repository with a clear license (MIT/Apache 2.0).',
      step1: {
        title: 'Station 1: Polish README with Badges & Live Demo',
        codeSnippet: '# Build something useful & craft a 10-star README\ngit commit -m "docs: add interactive architecture diagram and quickstart"',
        cliExplanation: 'Ensure visitors understand what the project solves within 5 seconds of loading the page.',
        webAlternative: 'Add shields.io badges, screenshots, and live demo links to your README.md.',
      },
      step2: {
        title: 'Station 2: Add Repository Topics & Open Graph Image',
        codeSnippet: 'gh repo edit --add-topic "typescript,react,developer-tools,productivity"',
        cliExplanation: 'Topics index your repository in GitHub Explore and topic search feeds.',
        webAlternative: 'Click the Settings gear on the repository homepage and add 5-8 relevant tags.',
      },
      step3: {
        title: 'Station 3: Share with Developer Communities',
        codeSnippet: '# Share on Hacker News (Show HN), Reddit (r/webdev, r/opensource), and X/Twitter',
        cliExplanation: 'Genuine community engagement brings real developers who star and fork your repository.',
        webAlternative: 'Post your project link in developer forums with an explanation of why you built it.',
      },
      webhookTriggerTime: 'GitHub updates Starstruck counter within 15–30 minutes of reaching 16 total stars.',
    },
    gotchas: [
      'Stars must be across your public repositories (private repository stars do not count towards the public badge).',
      'Never participate in fake star-exchange rings; GitHub regularly purges bot accounts and flags violators.',
    ],
    quiz: [
      {
        id: 'ss-1',
        question: 'How many total repository stars are required for Starstruck Tier 1?',
        options: ['16 Stars', '5 Stars', '100 Stars', '50 Stars'],
        correctIndex: 0,
        explanation: 'Tier 1 of Starstruck unlocks at 16 stars, Tier 2 (Bronze) at 128 stars, and Tier 3 (Silver) at 512 stars.',
      },
    ],
  },
  'public-sponsor': {
    badgeId: 'public-sponsor',
    badgeName: 'Public Sponsor',
    chapterNumber: '07',
    badgeIcon: '/images/badges/public-sponsor.png',
    tagline: 'Sustain the open-source software ecosystem through GitHub Sponsors.',
    estimatedTime: '3 Minutes',
    difficulty: 'Beginner',
    industryContext: {
      title: 'Open Source Sustainability & Patronage',
      description: 'Millions of critical web packages are maintained by volunteer developers. GitHub Sponsors enables direct financial backing, allowing maintainers to buy server time, maintain security audits, and work full-time on open source.',
      realWorldExample: 'A company or developer relies on curl, Vite, or SQLite in production and sponsors the author $5/month to support ongoing patch releases and security fixes.',
    },
    conceptsTaught: [
      {
        term: 'GitHub Sponsors Program',
        definition: 'GitHub’s native platform for sending one-time or recurring patronage to open source maintainers with zero platform fees.',
        proTip: 'Sponsoring anyone with a public sponsorship profile immediately grants you the Public Sponsor badge on your GitHub profile.',
      },
      {
        term: 'FUNDING.yml Manifest',
        definition: 'A standardized configuration file in `.github/FUNDING.yml` that displays a "Sponsor" button on a repository.',
        proTip: 'Adding `github: [username]` in `.github/FUNDING.yml` links your personal sponsorship tier.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Identify a favorite open source maintainer who has GitHub Sponsors enabled (e.g. Evan You, Caleb Porzio, or libraries you use daily).',
      step1: {
        title: 'Station 1: Visit Maintainer Profile',
        codeSnippet: 'open https://github.com/sponsors/<maintainer>',
        cliExplanation: 'Navigate to the maintainer’s sponsor portal in your browser.',
        webAlternative: 'Click the pink heart "Sponsor" button on their GitHub repository or profile.',
      },
      step2: {
        title: 'Station 2: Select a Tier or One-Time Donation',
        codeSnippet: '# Select $1 or custom sponsorship tier',
        cliExplanation: 'Both one-time and monthly sponsorships qualify for the permanent Public Sponsor badge.',
        webAlternative: 'Select the tier that suits you on github.com/sponsors.',
      },
      step3: {
        title: 'Station 3: Ensure "Make Public" is Selected',
        codeSnippet: '# Ensure the public checkbox is selected during checkout',
        cliExplanation: 'If you choose private/anonymous sponsorship, GitHub hides the badge to respect your privacy!',
        webAlternative: 'Verify that "Share my sponsorship publicly" is checked before completing payment.',
      },
      webhookTriggerTime: 'Immediate upon payment verification; badge displays on your GitHub profile in real-time.',
    },
    gotchas: [
      'If you sponsor privately (incognito), the Public Sponsor badge will NOT be displayed on your profile.',
      'Sponsorship must be completed via GitHub Sponsors, not an external link like Patreon or BuyMeACoffee.',
    ],
    quiz: [
      {
        id: 'ps-1',
        question: 'What setting must be enabled during checkout to receive the Public Sponsor badge?',
        options: ['Make sponsorship public on profile', 'Anonymous donation', 'Enterprise invoice', 'Sponsor via PayPal only'],
        correctIndex: 0,
        explanation: 'You must check the box to make your sponsorship public on your profile; anonymous sponsorships do not display public badges.',
      },
    ],
  },
  'heart-on-your-sleeve': {
    badgeId: 'heart-on-your-sleeve',
    badgeName: 'Heart on Your Sleeve',
    chapterNumber: '08',
    badgeIcon: '/images/badges/heart-on-your-sleeve.png',
    tagline: 'Promote healthy and positive open-source collaboration through feedback.',
    estimatedTime: '2 Minutes',
    difficulty: 'Beginner',
    industryContext: {
      title: 'Constructive Feedback and Emoji Reactions',
      description: 'Open source thrives on gratitude and positive reinforcement. Emoji reactions (+1, heart, rocket, eyes) provide fast, respectful feedback to maintainers and contributors without spamming thread notifications.',
      realWorldExample: 'A user opens a bug report. When a contributor submits a fix PR, community members react with a heart or rocket to show appreciation for the fast patch.',
    },
    conceptsTaught: [
      {
        term: 'Reaction API Telemetry',
        definition: 'GitHub’s reaction system allows 8 distinct emoji reactions: thumbs up, thumbs down, laugh, hooray, confused, heart, rocket, and eyes.',
        proTip: 'Reacting with a heart or celebratory emoji on community items encourages maintainers and builds contributor karma.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Visit any public repository, pull request, or issue thread on GitHub.',
      step1: {
        title: 'Station 1: Find a Community Issue or PR',
        codeSnippet: 'open https://github.com/<owner>/<repo>/issues/1',
        cliExplanation: 'Navigate to an active open source discussion or release announcement.',
        webAlternative: 'Open any issue or pull request in your browser.',
      },
      step2: {
        title: 'Station 2: Add an Emoji Reaction',
        codeSnippet: 'gh api --method POST /repos/<owner>/<repo>/issues/1/reactions -f content="heart"',
        cliExplanation: 'Submit a reaction via GitHub CLI or click the smiley face icon in the top right of the comment.',
        webAlternative: 'Click the smiley face icon and select the heart reaction.',
      },
      step3: {
        title: 'Station 3: Engage in Constructive Discussion',
        codeSnippet: '# Leave a polite note of appreciation or code feedback',
        cliExplanation: 'Positive developer etiquette fosters long-term open-source retention.',
        webAlternative: 'Add a helpful comment with your feedback or experience.',
      },
      webhookTriggerTime: 'Telemetry indexes within minutes of reaction submission.',
    },
    gotchas: [
      'Avoid spamming reactions on thousands of threads in seconds; automated scripts can trigger GitHub abuse filters.',
    ],
    quiz: [
      {
        id: 'hs-1',
        question: 'Why do open source maintainers prefer emoji reactions over "+1" comments?',
        options: [
          'Emoji reactions prevent spam notifications to all subscribed developers',
          'Comments are not allowed on GitHub',
          'Emojis load faster than text',
          'Reactions are paid features'
        ],
        correctIndex: 0,
        explanation: 'Reactions communicate agreement or gratitude without sending email notifications to dozens of watchers on the issue.',
      },
    ],
  },
  'open-sourcerer': {
    badgeId: 'open-sourcerer',
    badgeName: 'Open Sourcerer',
    chapterNumber: '09',
    badgeIcon: '/images/badges/open-sourcerer.png',
    tagline: 'Contribute high-impact pull requests to top open-source projects.',
    estimatedTime: '20 Minutes',
    difficulty: 'Advanced',
    industryContext: {
      title: 'Upstream Contribution & Fork-and-Pull Architecture',
      description: 'Major open source projects (like Kubernetes, VS Code, React, and Linux) rely on contributions from worldwide developers. Mastering the fork-and-pull workflow, rebasing, and CLA signing is the hallmark of a senior open-source engineer.',
      realWorldExample: 'A developer identifies a performance bug in an open-source library, forks the repository, creates a reproducible test case, and submits a PR upstream.',
    },
    conceptsTaught: [
      {
        term: 'Upstream Remote Tracking',
        definition: 'Configuring `git remote add upstream <url>` to pull updates from the original repository while developing on your fork.',
        proTip: 'Always sync your fork with `git fetch upstream && git merge upstream/main` before opening a pull request.',
      },
      {
        term: 'Contributor License Agreements (CLA)',
        definition: 'A legal agreement signed by contributors to grant the project rights to distribute the code under its open source license.',
        proTip: 'Most major foundations (Apache, Linux Foundation, CNCF) require automated CLA bot sign-offs on pull requests.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Fork an active open source project to your personal account on github.com.',
      step1: {
        title: 'Station 1: Clone Fork & Add Upstream Remote',
        codeSnippet: 'git clone https://github.com/<your-username>/<repo>.git\ncd <repo>\ngit remote add upstream https://github.com/<upstream-owner>/<repo>.git',
        cliExplanation: 'Sets up dual remote tracking so you can pull the latest upstream commits at any time.',
        webAlternative: 'Click "Fork" on the top right of the target repository on github.com.',
      },
      step2: {
        title: 'Station 2: Implement Fix on Feature Branch',
        codeSnippet: 'git switch -c fix/docs-typo-resolution\n# Edit files, run test suite\ngit commit -m "fix(docs): clarify getting-started configuration flags"\ngit push -u origin fix/docs-typo-resolution',
        cliExplanation: 'Never commit directly to your fork’s main branch; always create an isolated feature branch.',
        webAlternative: 'Use the web editor on your fork to make your changes on a new branch.',
      },
      step3: {
        title: 'Station 3: Submit Upstream PR with Detailed Context',
        codeSnippet: 'gh pr create --repo <upstream-owner>/<repo> --base main --head <your-username>:fix/docs-typo-resolution',
        cliExplanation: 'Follow the repository’s CONTRIBUTING.md checklist and fill out the pull request template completely.',
        webAlternative: 'Click "Contribute" -> "Open pull request" on your fork’s GitHub page.',
      },
      webhookTriggerTime: 'GitHub records the contribution upon upstream merge.',
    },
    gotchas: [
      'Always check the repository CONTRIBUTING.md before submitting; many projects require opening an issue first.',
      'Ensure all CI checks (linters, unit tests, code style) pass before requesting maintainer review.',
    ],
    quiz: [
      {
        id: 'os-1',
        question: 'Why should you create a feature branch rather than committing directly to your fork’s main branch?',
        options: [
          'It isolates your work and allows you to submit multiple clean pull requests simultaneously',
          'Git does not allow commits to main',
          'Forked main branches cannot be merged',
          'Main branches cannot run GitHub Actions'
        ],
        correctIndex: 0,
        explanation: 'Feature branches keep changes decoupled, allowing maintainers to review one isolated feature at a time while your main stays in sync with upstream.',
      },
    ],
  },
  'arctic-code-vault': {
    badgeId: 'arctic-code-vault',
    badgeName: 'Arctic Code Vault Contributor',
    chapterNumber: '10',
    badgeIcon: '/images/badges/arctic-code-vault.png',
    tagline: 'Preserve humanity’s open-source heritage in the Svalbard permafrost for 1,000 years.',
    estimatedTime: 'Historical Milestone',
    difficulty: 'Advanced',
    industryContext: {
      title: 'Digital Preservation & Long-Term Archival Systems',
      description: 'In 2020, GitHub launched the Arctic Code Vault project. A snapshot of all active public repositories was captured on 02/02/2020 and etched onto 186 reels of hardened photographic film stored 250 meters deep in a decommissioned coal mine in Svalbard, Norway.',
      realWorldExample: 'Humanity preserves essential software libraries, algorithms, operating systems, and documentation designed to survive catastrophic electromagnetic or digital failures for 1,000 years.',
    },
    conceptsTaught: [
      {
        term: 'Silver Halide Film Preservation',
        definition: 'Micro-etched frames capable of enduring 1,000+ years without bit-rot, readable with a simple magnifying lens and light source.',
        proTip: 'The vault contains a "Tech Tree" manual explaining computers, optics, and programming languages so future generations can read the data.',
      },
      {
        term: 'Archival Heritage Badges',
        definition: 'Special historical badges awarded to developers whose commits were included in the 02/02/2020 snapshot.',
        proTip: 'This badge is a permanent historical milestone celebrating early pioneers of the open-source movement.',
      },
    ],
    executionBlueprint: {
      prepStep: 'Review the official GitHub Arctic Code Vault documentary and preservation manifest.',
      step1: {
        title: 'Station 1: Inspect Historical Commit Heritage',
        codeSnippet: 'git log --before="2020-02-02" --oneline',
        cliExplanation: 'Checks if your account made public commits prior to the snapshot date of February 2, 2020.',
        webAlternative: 'Check your GitHub profile contribution graph for 2020 or earlier.',
      },
      step2: {
        title: 'Station 2: Study Svalbard Vault Architecture',
        codeSnippet: '# Read about Piql film, Svalbard permafrost, and the GitHub Archive Program',
        cliExplanation: 'Learn how archival scientists engineered radiation-resistant storage in the Arctic circle.',
        webAlternative: 'Visit archiveprogram.github.com to tour the 3D vault.',
      },
      step3: {
        title: 'Station 3: Build Enduring Software for the Future',
        codeSnippet: '# Write clean, documented, sustainable open-source software that outlasts trends',
        cliExplanation: 'Future archival snapshots will continue preserving modern infrastructure.',
        webAlternative: 'Ensure your current open-source repositories have open licenses and clear documentation.',
      },
      webhookTriggerTime: 'Historical milestone: Indexed for contributors included in the 2020 Svalbard archive snapshot.',
    },
    gotchas: [
      'This is a historical milestone: only accounts with public repository commits prior to 02/02/2020 qualify for the retroactive badge.',
    ],
    quiz: [
      {
        id: 'acv-1',
        question: 'Where is the GitHub Arctic Code Vault physically located?',
        options: [
          'Svalbard, Norway (inside an Arctic permafrost coal mine)',
          'Underneath GitHub HQ in San Francisco',
          'On the International Space Station',
          'In a desert bunker in Nevada'
        ],
        correctIndex: 0,
        explanation: 'The vault is located 250 meters deep in a decommissioned coal mine in Svalbard, Norway, protected by permafrost.',
      },
    ],
  },
};


