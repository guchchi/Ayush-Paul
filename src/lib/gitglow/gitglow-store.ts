import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserScanAnalysis, analyzeGitHubProfile } from './gitglow-api';

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

  // Step checklist state per badge
  badgeStepStatus: Record<string, boolean[]>; // badgeId -> [step1Done, step2Done, step3Done]
  toggleBadgeStep: (badgeId: string, stepIndex: number) => void;
  setAllStepsForBadge: (badgeId: string, completed: boolean) => void;

  // Interactive simulated execution in terminal
  executionLogs: Record<string, string[]>;
  appendLog: (badgeId: string, log: string) => void;
  clearLogs: (badgeId: string) => void;

  // Reset store
  reset: () => void;
}

const DEFAULT_REPO_NAME = 'gitglow-practice-sandbox';

export const useGitGlowStore = create<GitGlowStoreState>()(
  persist(
    (set, get) => ({
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
          const analysis = await analyzeGitHubProfile(clean);
          set({
            isScanning: false,
            scanAnalysis: analysis,
            scanError: null,
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

      completedMissionIds: ['m1-quickdraw'],
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
          badgeStepStatus: {},
          executionLogs: {},
        });
      },
    }),
    {
      name: 'gitglow-user-progress',
      partialize: (state) => ({
        targetUsername: state.targetUsername,
        testRepoName: state.testRepoName,
        completedMissionIds: state.completedMissionIds,
        badgeStepStatus: state.badgeStepStatus,
        scanAnalysis: state.scanAnalysis,
      }),
    }
  )
);

