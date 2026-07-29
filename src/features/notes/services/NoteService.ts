import { INoteService } from './INoteService';
import { PackNote } from '../../authority-pack/types';
import { StoreNotesRepository } from '../../authority-pack/repositories/storeNotesRepository';

export class NoteService implements INoteService {
  private repository: StoreNotesRepository;

  constructor(repository: StoreNotesRepository) {
    this.repository = repository;
  }

  public async saveNote(note: PackNote): Promise<void> {
    await this.repository.saveNote(note);
  }

  public async deleteNote(noteId: string): Promise<void> {
    await this.repository.deleteNote(noteId);
  }
}
