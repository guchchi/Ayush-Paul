import { StateCreator } from 'zustand';
import { AuthorityPackStoreState, ReadingSlice } from '../types';

const initialReadingState = {
  readSections: [],
};

export const createReadingSlice: StateCreator<
  AuthorityPackStoreState,
  [],
  [],
  ReadingSlice
> = (set) => ({
  ...initialReadingState,
  updateReading: (readSections) => set({ readSections }),
  resetReading: () => set(initialReadingState),
});
