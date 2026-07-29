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
  addOrUpdateNote: (note) => set((state) => {
    const existingIndex = state.notes.findIndex(n => n.id === note.id);
    if (existingIndex >= 0) {
      const newNotes = [...state.notes];
      newNotes[existingIndex] = note;
      return { notes: newNotes };
    }
    return { notes: [...state.notes, note] };
  }),
  removeNote: (id) => set((state) => ({
    notes: state.notes.filter(n => n.id !== id)
  })),
  resetNotes: () => set(initialNotesState),
});
