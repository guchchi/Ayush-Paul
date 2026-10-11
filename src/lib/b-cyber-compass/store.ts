/**
 * B.Cyber Compass — Preparation Planner Store (v2.3)
 *
 * Manages user diagnostic inputs, generated preparation roadmap, and task progress.
 * Uses Zustand with localStorage persistence.
 *
 * Local Storage Notice:
 * Progress is saved locally in this browser. Clearing browser data, cookies, or cache
 * will reset the stored plan. Data does not sync across devices.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagnosticInputs, GeneratedPlan } from '../../types/b-cyber-compass';
import { generatePreparationPlan } from './rule-engine';

export type PlannerTab = 'diagnostic' | 'gap_analysis' | 'phases' | 'proof_of_work' | 'weekly_calendar';

export interface BCyberPlannerState {
  // Diagnostic Inputs
  inputs: DiagnosticInputs;
  // Generated Plan
  generatedPlan: GeneratedPlan | null;
  // Task Completion Tracking
  completedTaskIds: string[];
  // Active UI View Tab
  activeTab: PlannerTab;
  // Selected Filter Category (optional UI convenience)
  selectedCategoryFilter: string | 'all';
  // Stage 7: Emergency Recovery Routine Mode
  isEmergencyRecoveryMode: boolean;
  // Stage 5: Proof-of-Work Artifact URLs
  proofOfWorkArtifacts: Record<string, string>;

  // Actions
  updateInputs: (partial: Partial<DiagnosticInputs>) => void;
  generatePlan: () => void;
  toggleTaskCompletion: (taskId: string) => void;
  setActiveTab: (tab: PlannerTab) => void;
  setCategoryFilter: (filter: string) => void;
  toggleRecoveryMode: () => void;
  setProofOfWorkArtifact: (key: string, url: string) => void;
  reset: () => void;
}

const DEFAULT_INPUTS: DiagnosticInputs = {
  selectedPathway: 'both',
  academicStage: 'class_11_12',
  technicalBaseline: 'zero_terminal',
  availableWeeklyHours: 8,
  primaryGoal: 'bcyber_admission',
  targetTimelineMonths: '6_months',
};

export const useBCyberPlannerStore = create<BCyberPlannerState>()(
  persist(
    (set, get) => ({
      inputs: { ...DEFAULT_INPUTS },
      generatedPlan: null,
      completedTaskIds: [],
      activeTab: 'diagnostic',
      selectedCategoryFilter: 'all',
      isEmergencyRecoveryMode: false,
      proofOfWorkArtifacts: {},

      updateInputs: (partial) => {
        set((state) => ({
          inputs: {
            ...state.inputs,
            ...partial,
            // Ensure weekly hours remains bounded between 3 and 25
            availableWeeklyHours: partial.availableWeeklyHours !== undefined
              ? Math.max(3, Math.min(25, partial.availableWeeklyHours))
              : state.inputs.availableWeeklyHours,
          },
        }));
      },

      generatePlan: () => {
        const { inputs } = get();
        const plan = generatePreparationPlan(inputs);
        set({
          generatedPlan: plan,
          activeTab: 'phases',
        });
      },

      toggleTaskCompletion: (taskId: string) => {
        set((state) => {
          const exists = state.completedTaskIds.includes(taskId);
          return {
            completedTaskIds: exists
              ? state.completedTaskIds.filter((id) => id !== taskId)
              : [...state.completedTaskIds, taskId],
          };
        });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setCategoryFilter: (filter) => set({ selectedCategoryFilter: filter }),

      toggleRecoveryMode: () =>
        set((state) => ({
          isEmergencyRecoveryMode: !state.isEmergencyRecoveryMode,
        })),

      setProofOfWorkArtifact: (key, url) =>
        set((state) => ({
          proofOfWorkArtifacts: {
            ...state.proofOfWorkArtifacts,
            [key]: url,
          },
        })),

      reset: () => {
        set({
          inputs: { ...DEFAULT_INPUTS },
          generatedPlan: null,
          completedTaskIds: [],
          activeTab: 'diagnostic',
          selectedCategoryFilter: 'all',
          isEmergencyRecoveryMode: false,
          proofOfWorkArtifacts: {},
        });
      },
    }),
    {
      name: 'b-cyber-compass-planner',
      version: 2,
      partialize: (state) => ({
        inputs: state.inputs,
        generatedPlan: state.generatedPlan,
        completedTaskIds: state.completedTaskIds,
        activeTab: state.activeTab,
        isEmergencyRecoveryMode: state.isEmergencyRecoveryMode,
        proofOfWorkArtifacts: state.proofOfWorkArtifacts,
      }),
    }
  )
);
