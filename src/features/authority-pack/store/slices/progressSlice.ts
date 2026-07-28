import { StateCreator } from 'zustand';
import { AuthorityPackStoreState, ProgressSlice } from '../types';

const initialProgressState = {
  completedActions: [],
};

export const createProgressSlice: StateCreator<
  AuthorityPackStoreState,
  [],
  [],
  ProgressSlice
> = (set) => ({
  ...initialProgressState,
  updateProgress: (completedActions) => set({ completedActions }),
  resetProgress: () => set(initialProgressState),
});
