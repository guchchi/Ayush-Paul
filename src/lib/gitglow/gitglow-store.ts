import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserScanAnalysis, analyzeGitHubProfile } from './gitglow-api';
import { GitGlowConnectedUser, getSavedGitGlowSession, disconnectGitGlowSession } from './gitglow-auth';

export interface CommandStationStep {
  id: string;
  badgeId: string;
  stepIndex: number;
  label: string;
  command: string;
  isExecuted: boolean;
  executedAt?: string;
  outputLog?: string;
}

export interface GitGlowStoreState {
  // Connected GitHub User (for real in-app execution)
  connectedUser: GitGlowConnectedUser | null;
  setConnectedUser: (user: GitGlowConnectedUser | null) => void;
  logoutGitHub: () => Promise<void>;

  // Current user handle being targeted
  targetUsername: string;
  testRepoName: string;
  setTargetUsername: (username: string) => void;
  setTestRepoName: (repo: string) => void;

  // Real profile scan state
  isScanning: boolean;
  scanError: string | null;
  scanAnalysis: UserScanAnalysis | null;
  runScan: (username: string) => Promise<UserScanAnalysis | null>;

  // Completed badge missions (persisted locally)
  completedMissionIds: string[];
  markMissionCompleted: (missionId: string) => void;
  toggleMission: (missionId: string) => void;

  // Owned Badges on GitHub Profile (auto-detected via scan or manually toggled)
  manualOwnershipOverrides: Record<string, boolean>;
  userOwnedBadgeIds?: string[];
  toggleBadgeOwnership: (badgeId: string) => void;
  isBadgeOwned: (badgeId: string) => boolean;

  // Step checklist state per badge
  badgeStepStatus: Record<string, boolean[]>; // badgeId -> [step1Done, step2Done, step3Done]
  toggleBadgeStep: (badgeId: string, stepIndex: number) => void;
  setAllStepsForBadge: (badgeId: string, completed: boolean) => void;

  // Interactive simulated execution in terminal
  executionLogs: Record<string, string[]>;
  appendLog: (badgeId: string, log: string) => void;
  clearLogs: (badgeId: string) => void;

  // Quiz scores & answered questions
  quizAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  answerQuizQuestion: (questionId: string, optionIndex: number) => void;

  // Reset store
  reset: () => void;
}

const DEFAULT_REPO_NAME = 'gitglow-practice-sandbox';

/**
 * Strips legacy false-positive evaluations from cached or stale scans.
 * Ensures badges like YOLO and Starstruck are only marked unlocked if they
 * are verified on the live achievements tab of GitHub.
 */
export function sanitizeScanAnalysis(analysis: UserScanAnalysis | null): UserScanAnalysis | null {
  if (!analysis) return null;
  const live = Array.isArray(analysis.liveEarnedAchievements) ? analysis.liveEarnedAchievements : [];
  const sanitizedEvals = { ...analysis.badgeEvaluations };

  const strictLiveBadges = [
    'yolo',
    'starstruck',
    'galaxy-brain',
    'pair-extraordinaire',
    'public-sponsor',
    'heart-on-your-sleeve',
    'open-sourcerer',
    'arctic-code-vault',
  ];

  strictLiveBadges.forEach((id) => {
    if (sanitizedEvals[id] && !live.includes(id)) {
      sanitizedEvals[id] = {
        ...sanitizedEvals[id],
        isUnlocked: false,
        statusLabel:
          id === 'starstruck'
            ? '16 Stars Required'
            : id === 'yolo'
            ? 'Not Yet Earned'
            : id === 'galaxy-brain'
            ? 'Discussions Needed'
            : id === 'pair-extraordinaire'
            ? 'Co-Authoring Required'
            : 'Not Yet Earned',
        progressPercent: 0,
      };
    }
  });

  return {
    ...analysis,
    badgeEvaluations: sanitizedEvals,
  };
}

export const useGitGlowStore = create<GitGlowStoreState>()(
  persist(
    (set, get) => ({
      connectedUser: getSavedGitGlowSession(),
      setConnectedUser: (user: GitGlowConnectedUser | null) => {
        set({
          connectedUser: user,
          targetUsername: user?.githubUsername || get().targetUsername,
        });
      },
      logoutGitHub: async () => {
        await disconnectGitGlowSession();
        set({ connectedUser: null });
      },

      targetUsername: 'guchchi',
      testRepoName: DEFAULT_REPO_NAME,
      setTargetUsername: (username: string) => set({ targetUsername: username.trim().replace(/^@/, '') }),
      setTestRepoName: (repo: string) => set({ testRepoName: repo.trim() }),

      isScanning: false,
      scanError: null,
      scanAnalysis: null,

      runScan: async (username: string) => {
        const clean = username.trim().replace(/^@/, '') || get().targetUsername || 'developer';
        set({ isScanning: true, scanError: null, targetUsername: clean });
        try {
          const rawAnalysis = await analyzeGitHubProfile(clean);
          const analysis = sanitizeScanAnalysis(rawAnalysis);
          set({
            isScanning: false,
            scanAnalysis: analysis,
            scanError: null,
            manualOwnershipOverrides: {},
          });
          return analysis;
        } catch (err: any) {
          set({
            isScanning: false,
            scanError: err.message || 'Failed to scan profile',
          });
          return null;
        }
      },

      completedMissionIds: [],
      markMissionCompleted: (missionId: string) => {
        const current = get().completedMissionIds;
        if (!current.includes(missionId)) {
          set({ completedMissionIds: [...current, missionId] });
        }
      },
      toggleMission: (missionId: string) => {
        const current = get().completedMissionIds;
        if (current.includes(missionId)) {
          set({ completedMissionIds: current.filter((id) => id !== missionId) });
        } else {
          set({ completedMissionIds: [...current, missionId] });
        }
      },

      manualOwnershipOverrides: {},
      toggleBadgeOwnership: (badgeId: string) => {
        const current = { ...get().manualOwnershipOverrides };
        const currentlyOwned = get().isBadgeOwned(badgeId);
        current[badgeId] = !currentlyOwned;
        set({ manualOwnershipOverrides: current });
      },
      isBadgeOwned: (badgeId: string) => {
        const state = get();
        // 1. Check manual user override
        if (state.manualOwnershipOverrides[badgeId] !== undefined) {
          return state.manualOwnershipOverrides[badgeId];
        }

        // 2. Check precise live GitHub achievements & verified metrics
        const analysis = state.scanAnalysis;
        if (analysis) {
          const live = Array.isArray(analysis.liveEarnedAchievements)
            ? analysis.liveEarnedAchievements
            : [];

          // Direct match against live GitHub achievements tab
          if (live.includes(badgeId)) {
            return true;
          }
          if (badgeId === 'arctic-code-vault' && live.includes('arctic-code-vault-contributor')) {
            return true;
          }

          // Strict ground-truth badges: if not on GitHub achievements tab, they are NOT owned
          const strictBadges = [
            'yolo',
            'starstruck',
            'galaxy-brain',
            'pair-extraordinaire',
            'public-sponsor',
            'heart-on-your-sleeve',
            'open-sourcerer',
            'arctic-code-vault',
          ];
          if (strictBadges.includes(badgeId)) {
            return false;
          }

          // For Quickdraw and Pull Shark: allow verified metrics fallback if present
          if (badgeId === 'pull-shark') {
            return analysis.totalMergedPrs >= 2 || live.includes('pull-shark');
          }
          if (badgeId === 'quickdraw') {
            return Boolean(analysis.quickdrawQualified) || live.includes('quickdraw');
          }

          // Otherwise consult sanitized evaluation
          return Boolean(analysis.badgeEvaluations?.[badgeId]?.isUnlocked);
        }

        return false;
      },

      badgeStepStatus: {
        quickdraw: [true, true, true],
        'pull-shark': [true, false, false],
        yolo: [false, false, false],
        'pair-extraordinaire': [false, false, false],
        'galaxy-brain': [false, false, false],
        starstruck: [false, false, false],
      },

      toggleBadgeStep: (badgeId: string, stepIndex: number) => {
        const current = { ...get().badgeStepStatus };
        const steps = current[badgeId] ? [...current[badgeId]] : [false, false, false];
        steps[stepIndex] = !steps[stepIndex];
        current[badgeId] = steps;

        // If all 3 are completed, mark corresponding mission as completed
        const missionMapping: Record<string, string> = {
          quickdraw: 'm1-quickdraw',
          'pull-shark': 'm2-pull-shark',
          'pair-extraordinaire': 'm3-pair-collab',
          yolo: 'm4-yolo-merge',
          'galaxy-brain': 'm5-discussion-solver',
        };

        const targetMission = missionMapping[badgeId];
        let completedMissions = get().completedMissionIds;
        if (steps.every(Boolean)) {
          if (targetMission && !completedMissions.includes(targetMission)) {
            completedMissions = [...completedMissions, targetMission];
          }
        }

        set({ badgeStepStatus: current, completedMissionIds: completedMissions });
      },

      setAllStepsForBadge: (badgeId: string, completed: boolean) => {
        const current = { ...get().badgeStepStatus };
        current[badgeId] = [completed, completed, completed];
        set({ badgeStepStatus: current });
      },

      executionLogs: {},
      appendLog: (badgeId: string, log: string) => {
        const logs = { ...get().executionLogs };
        const badgeLogs = logs[badgeId] ? [...logs[badgeId]] : [];
        badgeLogs.push(`[${new Date().toLocaleTimeString()}] ${log}`);
        logs[badgeId] = badgeLogs;
        set({ executionLogs: logs });
      },
      quizAnswers: {},
      answerQuizQuestion: (questionId: string, optionIndex: number) => {
        const current = { ...get().quizAnswers };
        current[questionId] = optionIndex;
        set({ quizAnswers: current });
      },

      clearLogs: (badgeId: string) => {
        const logs = { ...get().executionLogs };
        delete logs[badgeId];
        set({ executionLogs: logs });
      },

      reset: () => {
        set({
          targetUsername: 'developer',
          testRepoName: DEFAULT_REPO_NAME,
          isScanning: false,
          scanError: null,
          scanAnalysis: null,
          completedMissionIds: [],
          manualOwnershipOverrides: {},
          badgeStepStatus: {},
          executionLogs: {},
          quizAnswers: {},
        });
      },
    }),
    {
      name: 'gitglow-user-progress',
      version: 5,
      migrate: (persistedState: any, version: number) => {
        // Invalidate stale/legacy scanAnalysis and manual overrides
        if (!version || version < 5) {
          return {
            ...persistedState,
            scanAnalysis: null,
            manualOwnershipOverrides: {},
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        targetUsername: state.targetUsername,
        testRepoName: state.testRepoName,
        completedMissionIds: state.completedMissionIds,
        manualOwnershipOverrides: state.manualOwnershipOverrides,
        badgeStepStatus: state.badgeStepStatus,
        scanAnalysis: sanitizeScanAnalysis(state.scanAnalysis),
        quizAnswers: state.quizAnswers,
        connectedUser: state.connectedUser,
      }),
    }
  )
);

