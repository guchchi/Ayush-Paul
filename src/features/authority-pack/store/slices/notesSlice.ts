import { StateCreator } from 'zustand';
import { AuthorityPackStoreState, NotesSlice } from '../types';

const initialNotesState = {
  notes: [],
};

export const createNotesSlice: StateCreator<
  AuthorityPackStoreState,
  [],
  [],
  NotesSlice
> = (set) => ({
  ...initialNotesState,
  updateNotes: (notes) => set({ notes }),
  resetNotes: () => set(initialNotesState),
});
