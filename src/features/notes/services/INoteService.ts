import { PackNote } from '../../authority-pack/types';

export interface INoteService {
  /**
   * Saves or updates a note.
   */
  saveNote(note: PackNote): Promise<void>;

  /**
   * Deletes a note by its ID.
   */
  deleteNote(noteId: string): Promise<void>;
}
