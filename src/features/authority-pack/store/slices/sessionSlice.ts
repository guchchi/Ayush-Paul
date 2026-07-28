import { StateCreator } from 'zustand';
import { AuthorityPackStoreState, SessionSlice } from '../types';

const initialSessionState = {
  activeSectionId: null,
};

export const createSessionSlice: StateCreator<
  AuthorityPackStoreState,
  [],
  [],
  SessionSlice
> = (set) => ({
  ...initialSessionState,
  updateSession: (updates) => set((state) => ({ ...state, ...updates })),
  resetSession: () => set(initialSessionState),
});
