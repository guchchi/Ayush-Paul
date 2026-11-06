export type BadgeDifficulty = 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Special';
export type BadgeCategory = 'beginner' | 'collaborative' | 'community' | 'milestone' | 'legacy';
export type BadgeStatus = 'obtainable' | 'testing' | 'unobtainable';

export interface BadgeTier {
  level: 'Default' | 'Bronze (x2)' | 'Silver (x3)' | 'Gold (x4)';
  threshold: string;
  description: string;
}

export interface GitHubBadge {
  id: string;
  name: string;
  image: string;
  tagline: string;
  difficulty: BadgeDifficulty;
  category: BadgeCategory;
  status: BadgeStatus;
  statusLabel: string;
  isObtainable: boolean;
  isRecommendedStarter: boolean;
  howToGet: string;
  blueprintStrategy: string;
  tiers?: BadgeTier[];
  requirements: string[];
  gotchas: string[];
  skinToneSupport?: boolean;
}

export const GITHUB_BADGES: GitHubBadge[] = [
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    image: '/images/badges/quickdraw.png',
    tagline: 'Gitty up! Closed an issue or PR within 5 minutes.',
    difficulty: 'Very Easy',
    category: 'beginner',
    status: 'obtainable',
    statusLabel: 'Obtainable · 5 Mins',
    isObtainable: true,
    isRecommendedStarter: true,
    howToGet: 'Close an issue or pull request within 5 minutes of opening it.',
    blueprintStrategy: 'Create a temporary tracking issue on your own personal repository and close it within 120 seconds.',
    requirements: [
      'Can be performed on your own personal public repository',
      'Open a test issue or pull request with clear description',
      'Close the issue/PR within 300 seconds (5 minutes)',
      'GitHub updates profile achievements within 10–30 minutes'
    ],
    gotchas: [
      'Do not delete the repository immediately after closing; GitHub needs to index the closed event.',
      'Closing PRs without merging also qualifies as long as it is within the 5-minute window.'
    ],
    skinToneSupport: true,
  },
  {
    id: 'pull-shark',
    name: 'Pull Shark',
    image: '/images/badges/pull-shark.png',
    tagline: 'Merged 2+ pull requests across GitHub repositories.',
    difficulty: 'Easy',
    category: 'beginner',
    status: 'obtainable',
    statusLabel: 'Obtainable · Core Flagship',
    isObtainable: true,
    isRecommendedStarter: true,
    howToGet: 'Have 2 pull requests merged into a public repository.',
    blueprintStrategy: 'Submit 2 verified contributor cards to our sandbox repository with instant automated merge.',
    tiers: [
      { level: 'Default', threshold: '2 merged PRs', description: 'Unlocks base Pull Shark 🦈 badge' },
      { level: 'Bronze (x2)', threshold: '16 merged PRs', description: 'Bronze badge border with x2 multiplier' },
      { level: 'Silver (x3)', threshold: '128 merged PRs', description: 'Silver badge border with x3 multiplier' },
      { level: 'Gold (x4)', threshold: '1,024 merged PRs', description: 'Gold badge border with x4 multiplier' },
    ],
    requirements: [
      'PRs must be merged, not merely closed or rejected',
      'Merged into default branch (main/master)',
      'PRs can be to your own repository or community repositories',
      'Qualifies for tier multipliers as PR volume increases'
    ],
    gotchas: [
      'Draft PRs do not count until marked ready for review and merged.',
      'Merging pull requests in private repositories only counts if private contributions are enabled in profile settings.'
    ],
  },
  {
    id: 'yolo',
    name: 'YOLO',
    image: '/images/badges/yolo.png',
    tagline: 'Merged a pull request without code review.',
    difficulty: 'Easy',
    category: 'collaborative',
    status: 'obtainable',
    statusLabel: 'Obtainable · 10 Mins',
    isObtainable: true,
    isRecommendedStarter: true,
    howToGet: 'Merge a pull request without requesting or waiting for a code review.',
    blueprintStrategy: 'Open a PR on your own repository, then merge it directly to main without code review.',
    requirements: [
      'Requires opening a pull request from a branch to the main branch',
      'Direct merge without clicking "Request Review" or adding reviewers',
      'Confirm the merge commit on the repository default branch'
    ],
    gotchas: [
      'If your repository has branch protection rules requiring 1+ reviews, you must temporarily disable the review requirement to merge solo.'
    ],
  },
  {
    id: 'pair-extraordinaire',
    name: 'Pair Extraordinaire',
    image: '/images/badges/pair-extraordinaire.png',
    tagline: 'Coauthored a commit on a merged pull request.',
    difficulty: 'Medium',
    category: 'collaborative',
    status: 'obtainable',
    statusLabel: 'Obtainable · Collaborative',
    isObtainable: true,
    isRecommendedStarter: false,
    howToGet: 'Co-author at least one commit on a merged pull request using the Git Co-authored-by trailer.',
    blueprintStrategy: 'Commit with a dual-author Git message trailer pointing to a collaborator, then merge the pull request.',
    tiers: [
      { level: 'Default', threshold: '1 merged coauthored PR', description: 'Unlocks base Pair Extraordinaire badge' },
      { level: 'Bronze (x2)', threshold: '10 merged PRs', description: 'Bronze badge border with x2 multiplier' },
      { level: 'Silver (x3)', threshold: '24 merged PRs', description: 'Silver badge border with x3 multiplier' },
      { level: 'Gold (x4)', threshold: '48 merged PRs', description: 'Gold badge border with x4 multiplier' },
    ],
    requirements: [
      'The commit message body must contain: Co-authored-by: Name <email@example.com>',
      'There must be an empty line between the commit description and the trailer',
      'The PR containing the commit must be merged into the target repository default branch'
    ],
    gotchas: [
      'The co-author email must match a verified GitHub account email address.',
      'Formatting error in the trailer will cause GitHub to ignore the co-authorship.'
    ],
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy Brain',
    image: '/images/badges/galaxy-brain.png',
    tagline: 'Answered a GitHub discussion with an accepted solution.',
    difficulty: 'Medium',
    category: 'community',
    status: 'obtainable',
    statusLabel: 'Obtainable · Community',
    isObtainable: true,
    isRecommendedStarter: false,
    howToGet: 'Get 2 accepted answers in GitHub Discussions across public repositories.',
    blueprintStrategy: 'Answer community Q&A discussions and get 2 responses marked as accepted answers.',
    tiers: [
      { level: 'Default', threshold: '2 accepted answers', description: 'Unlocks base Galaxy Brain badge' },
      { level: 'Bronze (x2)', threshold: '8 accepted answers', description: 'Bronze badge border with x2 multiplier' },
      { level: 'Silver (x3)', threshold: '16 accepted answers', description: 'Silver badge border with x3 multiplier' },
      { level: 'Gold (x4)', threshold: '32 accepted answers', description: 'Gold badge border with x4 multiplier' },
    ],
    requirements: [
      'The repository must have GitHub Discussions enabled with Q&A format',
      'The original poster or repo maintainer must mark your response as the accepted answer'
    ],
    gotchas: [
      'Regular comments in issues do not count; it must be in a GitHub Discussions section marked as an answer.'
    ],
  },
  {
    id: 'starstruck',
    name: 'Starstruck',
    image: '/images/badges/starstruck.png',
    tagline: 'Created a repository that reached 16+ stars.',
    difficulty: 'Hard',
    category: 'milestone',
    status: 'obtainable',
    statusLabel: 'Obtainable · Milestone',
    isObtainable: true,
    isRecommendedStarter: false,
    howToGet: 'Create a public repository that earns at least 16 stars from the GitHub community.',
    blueprintStrategy: 'Publish an open-source template or developer utility to reach the 16 stars milestone.',
    tiers: [
      { level: 'Default', threshold: '16 repository stars', description: 'Unlocks base Starstruck badge' },
      { level: 'Bronze (x2)', threshold: '128 repository stars', description: 'Bronze badge border with x2 multiplier' },
      { level: 'Silver (x3)', threshold: '512 repository stars', description: 'Silver badge border with x3 multiplier' },
      { level: 'Gold (x4)', threshold: '4,096 repository stars', description: 'Gold badge border with x4 multiplier' },
    ],
    requirements: [
      'Repository must be public and owned by your personal account',
      'Stars must be genuine from active GitHub accounts'
    ],
    gotchas: [
      'Stars on forked repositories generally do not credit the forker unless significant original contributions are made.'
    ],
    skinToneSupport: true,
  },
  {
    id: 'public-sponsor',
    name: 'Public Sponsor',
    image: '/images/badges/public-sponsor.png',
    tagline: 'Sponsored an open-source contributor through GitHub Sponsors.',
    difficulty: 'Very Easy',
    category: 'community',
    status: 'obtainable',
    statusLabel: 'Obtainable · Paid Sponsor',
    isObtainable: true,
    isRecommendedStarter: false,
    howToGet: 'Sponsor an open-source contributor or organization through GitHub Sponsors ($1+).',
    blueprintStrategy: 'Choose an open-source creator you admire and sponsor them for $1 with public sponsorship visibility enabled.',
    requirements: [
      'Requires a GitHub account with payment method configured',
      'Sponsorship must be set to "Public" (Private sponsorships do not show the badge)',
      'Active sponsorship badge appears immediately after transaction confirmation'
    ],
    gotchas: [
      'If you cancel the sponsorship, the badge remains on your past sponsorships section unless you hide it in profile settings.'
    ],
  },
  {
    id: 'heart-on-your-sleeve',
    name: 'Heart On Your Sleeve',
    image: '/images/badges/heart-on-your-sleeve.png',
    tagline: 'Reacted to issues/PRs with a ❤️ emoji.',
    difficulty: 'Very Easy',
    category: 'milestone',
    status: 'testing',
    statusLabel: 'Testing · In Beta Rollout',
    isObtainable: false,
    isRecommendedStarter: false,
    howToGet: 'React to commits, pull requests, or issues on GitHub with the ❤️ emoji.',
    blueprintStrategy: 'Currently rolling out in select GitHub test clusters. We track its availability in the blueprint engine.',
    requirements: [
      'React to public GitHub activity with the heart reaction',
      'Currently in limited test phase by GitHub Engineering'
    ],
    gotchas: [
      'Not yet enabled globally for all accounts; will automatically activate when GitHub promotes to general availability.'
    ],
  },
  {
    id: 'open-sourcerer',
    name: 'Open Sourcerer',
    image: '/images/badges/open-sourcerer.png',
    tagline: 'Had pull requests merged across multiple public repositories.',
    difficulty: 'Medium',
    category: 'milestone',
    status: 'testing',
    statusLabel: 'Testing · In Beta Rollout',
    isObtainable: false,
    isRecommendedStarter: false,
    howToGet: 'Contribute merged pull requests across multiple distinct public repositories.',
    blueprintStrategy: 'Currently in closed beta testing by GitHub. We monitor its activation conditions.',
    requirements: [
      'Contributions across multiple unique GitHub organizations/repos'
    ],
    gotchas: [
      'Badge is in testing stage as documented by GitHub community archives.'
    ],
  },
  {
    id: 'arctic-code-vault',
    name: 'Arctic Code Vault Contributor',
    image: '/images/badges/arctic-code-vault.png',
    tagline: 'Contributed code to the 2020 GitHub Archive Program.',
    difficulty: 'Special',
    category: 'legacy',
    status: 'unobtainable',
    statusLabel: 'Historic Archive · 2020',
    isObtainable: false,
    isRecommendedStarter: false,
    howToGet: 'Awarded to users who contributed to repositories captured in the 02/02/2020 Arctic World Archive snapshot.',
    blueprintStrategy: 'Historic achievement archived in February 2020; permanently closed for new entries.',
    requirements: [
      'Active commit on an archived repository prior to February 2, 2020'
    ],
    gotchas: [
      'Cannot be unlocked on new accounts created after February 2020.'
    ],
  },
];

