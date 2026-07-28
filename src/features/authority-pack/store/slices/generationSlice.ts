import { StateCreator } from 'zustand';
import { AuthorityPackStoreState, GenerationSlice } from '../types';

const initialGenerationState = {
  isGenerating: false,
  error: null,
};

export const createGenerationSlice: StateCreator<
  AuthorityPackStoreState,
  [],
  [],
  GenerationSlice
> = (set) => ({
  ...initialGenerationState,
  updateGeneration: (updates) => set((state) => ({ ...state, ...updates })),
  resetGeneration: () => set(initialGenerationState),
});
