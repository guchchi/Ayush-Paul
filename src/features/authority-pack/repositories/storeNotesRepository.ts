import { INotesRepository } from './index';
import { PackNote } from '../types';
import { useAuthorityPackStore } from '../store/useAuthorityPackStore';

/**
 * LocalStorage backed Notes Repository (via Zustand)
 */
export class StoreNotesRepository implements INotesRepository {
  async getNotes(packId: string): Promise<PackNote[]> {
    return useAuthorityPackStore.getState().notes.filter(n => n.packId === packId);
  }

  async saveNote(note: PackNote): Promise<void> {
    const state = useAuthorityPackStore.getState();
    const existing = state.notes;
    const isUpdate = existing.some(n => n.id === note.id);
    
    if (isUpdate) {
      state.updateNotes(existing.map(n => n.id === note.id ? note : n));
    } else {
      state.updateNotes([...existing, note]);
    }
  }

  async deleteNote(id: string): Promise<void> {
    const state = useAuthorityPackStore.getState();
    state.updateNotes(state.notes.filter(n => n.id !== id));
  }
}
