import { StateCreator } from 'zustand';
import { AuthorityPackStoreState, WorkspaceSlice } from '../types';

const initialWorkspaceState = {
  pack: null,
  preferences: {},
};

export const createWorkspaceSlice: StateCreator<
  AuthorityPackStoreState,
  [],
  [],
  WorkspaceSlice
> = (set) => ({
  ...initialWorkspaceState,
  updateWorkspace: (updates) => set((state) => ({ ...state, ...updates })),
  resetWorkspace: () => set(initialWorkspaceState),
});
