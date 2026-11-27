import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserScanAnalysis, analyzeGitHubProfile, checkLiveGitHubAchievements } from './gitglow-api';
import { GitGlowConnectedUser, getSavedGitGlowSession, disconnectGitGlowSession } from './gitglow-auth';

export type BadgeLifecycleState = 'unclaimed' | 'indexing_queued' | 'live_verified';

export interface BadgeLifecycleInfo {
  state: BadgeLifecycleState;
  label: string;
  badgeId: string;
  isLive: boolean;
  isQueued: boolean;
  queuedAt?: string;
  prNumber?: number;
  prUrl?: string;
  detail: string;
}

export interface IndexingQueuedBadge {
  queuedAt: string;
  prNumber?: number;
  prUrl?: string;
  detail?: string;
  badgeName?: string;
}

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
  refreshLiveAchievements: (username?: string) => Promise<string[]>;

  // Completed badge missions (persisted locally)
  completedMissionIds: string[];
  markMissionCompleted: (missionId: string) => void;
  toggleMission: (missionId: string) => void;

  // 3-Tier Badge Lifecycle State (Silicon Valley Async Model)
  indexingQueuedBadges: Record<string, IndexingQueuedBadge>;
  markBadgeIndexingQueued: (
    badgeId: string,
    metadata?: { prNumber?: number; prUrl?: string; detail?: string; badgeName?: string }
  ) => void;
  clearBadgeIndexingQueued: (badgeId: string) => void;
  getBadgeLifecycle: (badgeId: string) => BadgeLifecycleInfo;
  isBadgeIndexingQueued: (badgeId: string) => boolean;

  // Owned Badges on GitHub Profile (auto-detected via scan or manually toggled)
  manualOwnershipOverrides: Record<string, boolean>;
  userOwnedBadgeIds?: string[];
  toggleBadgeOwnership: (badgeId: string) => void;
  setBadgeOwnership: (badgeId: string, owned: boolean) => void;
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

      targetUsername: '',
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
          
          // Clear any queued badges that are now live on GitHub
          const queued = { ...get().indexingQueuedBadges };
          const live = Array.isArray(analysis?.liveEarnedAchievements) ? analysis!.liveEarnedAchievements : [];
          let changed = false;
          live.forEach((badgeId) => {
            if (queued[badgeId]) {
              delete queued[badgeId];
              changed = true;
            }
          });

          set({
            isScanning: false,
            scanAnalysis: analysis,
            scanError: null,
            manualOwnershipOverrides: {},
            ...(changed ? { indexingQueuedBadges: queued } : {}),
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

      refreshLiveAchievements: async (username?: string) => {
        const clean = (username || get().connectedUser?.githubUsername || get().targetUsername || 'developer').trim().replace(/^@/, '');
        try {
          const liveAchievements = await checkLiveGitHubAchievements(clean);
          const currentAnalysis = get().scanAnalysis;
          if (currentAnalysis) {
            const updatedAnalysis = sanitizeScanAnalysis({
              ...currentAnalysis,
              liveEarnedAchievements: liveAchievements,
            });
            set({ scanAnalysis: updatedAnalysis });
          }
          // Clear any queued badges that are now live on GitHub
          const queued = { ...get().indexingQueuedBadges };
          let changed = false;
          liveAchievements.forEach((badgeId) => {
            if (queued[badgeId]) {
              delete queued[badgeId];
              changed = true;
            }
          });
          if (changed) {
            set({ indexingQueuedBadges: queued });
          }
          return liveAchievements;
        } catch (err) {
          console.warn('refreshLiveAchievements error:', err);
          return get().scanAnalysis?.liveEarnedAchievements || [];
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

      // 3-Tier Lifecycle State Machine (Silicon Valley Async Upstream Model)
      indexingQueuedBadges: {},
      markBadgeIndexingQueued: (badgeId: string, metadata?: { prNumber?: number; prUrl?: string; detail?: string; badgeName?: string }) => {
        const current = { ...get().indexingQueuedBadges };
        current[badgeId] = {
          queuedAt: new Date().toISOString(),
          prNumber: metadata?.prNumber,
          prUrl: metadata?.prUrl,
          detail: metadata?.detail,
          badgeName: metadata?.badgeName,
        };
        set({ indexingQueuedBadges: current });
      },
      clearBadgeIndexingQueued: (badgeId: string) => {
        const current = { ...get().indexingQueuedBadges };
        delete current[badgeId];
        set({ indexingQueuedBadges: current });
      },
      isBadgeIndexingQueued: (badgeId: string) => {
        return get().getBadgeLifecycle(badgeId).state === 'indexing_queued';
      },
      getBadgeLifecycle: (badgeId: string): BadgeLifecycleInfo => {
        const state = get();
        const analysis = state.scanAnalysis;
        const live = Array.isArray(analysis?.liveEarnedAchievements)
          ? analysis!.liveEarnedAchievements
          : [];

        // 1. Manual user override check (if explicitly set)
        if (state.manualOwnershipOverrides[badgeId] !== undefined) {
          if (state.manualOwnershipOverrides[badgeId]) {
            return {
              state: 'live_verified',
              label: 'Live on GitHub Profile',
              badgeId,
              isLive: true,
              isQueued: false,
              detail: 'Manually marked as owned on GitHub profile.',
            };
          }
          return {
            state: 'unclaimed',
            label: 'Not Yet Earned',
            badgeId,
            isLive: false,
            isQueued: false,
            detail: 'Manually marked as unearned.',
          };
        }

        // 2. Strict Live GitHub Profile Ground Truth
        let isLiveOnGitHub = live.includes(badgeId);
        if (!isLiveOnGitHub && badgeId === 'arctic-code-vault' && live.includes('arctic-code-vault-contributor')) {
          isLiveOnGitHub = true;
        }
        if (!isLiveOnGitHub && badgeId === 'pull-shark' && (analysis?.totalMergedPrs ?? 0) >= 2) {
          isLiveOnGitHub = true;
        }
        if (!isLiveOnGitHub && badgeId === 'quickdraw' && Boolean(analysis?.quickdrawQualified)) {
          isLiveOnGitHub = true;
        }

        if (isLiveOnGitHub) {
          return {
            state: 'live_verified',
            label: 'Live on GitHub Profile',
            badgeId,
            isLive: true,
            isQueued: false,
            detail: 'Confirmed on your official GitHub profile achievements tab.',
          };
        }

        // 3. Indexing Queued (In-app action executed, PR merged, waiting for GitHub batch cron)
        const missionMapping: Record<string, string> = {
          quickdraw: 'm1-quickdraw-speed',
          'pull-shark': 'm2-pr-powerhouse',
          'pair-extraordinaire': 'm3-pair-collab',
          yolo: 'm4-yolo-merge',
          starstruck: 'm5-star-velocity',
          'galaxy-brain': 'm6-discussion-mastery',
          'public-sponsor': 'm7-sponsor-economy',
        };
        const targetMission = missionMapping[badgeId];
        const isMissionDone = targetMission && state.completedMissionIds.includes(targetMission);
        const queuedData = state.indexingQueuedBadges[badgeId];

        if (queuedData || isMissionDone) {
          return {
            state: 'indexing_queued',
            label: 'Queued for Indexing (24–72h SLA)',
            badgeId,
            isLive: false,
            isQueued: true,
            queuedAt: queuedData?.queuedAt,
            prNumber: queuedData?.prNumber,
            prUrl: queuedData?.prUrl,
            detail:
              queuedData?.detail ||
              'Work merged into default branch. GitHub attribution worker processing in background.',
          };
        }

        // 4. Default: Unclaimed
        return {
          state: 'unclaimed',
          label: 'Not Yet Earned',
          badgeId,
          isLive: false,
          isQueued: false,
          detail: 'Action not yet executed.',
        };
      },

      manualOwnershipOverrides: {},
      toggleBadgeOwnership: (badgeId: string) => {
        const current = { ...get().manualOwnershipOverrides };
        const currentlyOwned = get().isBadgeOwned(badgeId);
        current[badgeId] = !currentlyOwned;
        set({ manualOwnershipOverrides: current });
      },
      setBadgeOwnership: (badgeId: string, owned: boolean) => {
        const current = { ...get().manualOwnershipOverrides };
        current[badgeId] = owned;
        set({ manualOwnershipOverrides: current });
      },
      isBadgeOwned: (badgeId: string) => {
        return get().getBadgeLifecycle(badgeId).state === 'live_verified';
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
          quickdraw: 'm1-quickdraw-speed',
          'pull-shark': 'm2-pr-powerhouse',
          'pair-extraordinaire': 'm3-pair-collab',
          yolo: 'm4-yolo-merge',
          'galaxy-brain': 'm6-discussion-mastery',
          starstruck: 'm5-star-velocity',
          'public-sponsor': 'm7-sponsor-economy',
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
          targetUsername: '',
          testRepoName: DEFAULT_REPO_NAME,
          isScanning: false,
          scanError: null,
          scanAnalysis: null,
          completedMissionIds: [],
          indexingQueuedBadges: {},
          manualOwnershipOverrides: {},
          badgeStepStatus: {},
          executionLogs: {},
          quizAnswers: {},
        });
      },
    }),
    {
      name: 'gitglow-user-progress',
      version: 6,
      migrate: (persistedState: any, version: number) => {
        // Invalidate stale/legacy scanAnalysis and manual overrides
        if (!version || version < 6) {
          return {
            ...persistedState,
            scanAnalysis: null,
            manualOwnershipOverrides: {},
            indexingQueuedBadges: persistedState?.indexingQueuedBadges || {},
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        targetUsername: state.targetUsername,
        testRepoName: state.testRepoName,
        completedMissionIds: state.completedMissionIds,
        manualOwnershipOverrides: state.manualOwnershipOverrides,
        indexingQueuedBadges: state.indexingQueuedBadges,
        badgeStepStatus: state.badgeStepStatus,
        scanAnalysis: sanitizeScanAnalysis(state.scanAnalysis),
        quizAnswers: state.quizAnswers,
        connectedUser: state.connectedUser,
      }),
    }
  )
);

