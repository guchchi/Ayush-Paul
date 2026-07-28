import { AuthorityPackDomain, PackNote, PackStatus } from '../types';

export interface IAuthorityPackRepository {
  get(id: string): Promise<AuthorityPackDomain | null>;
  save(pack: AuthorityPackDomain): Promise<void>;
  updateStatus(id: string, status: PackStatus): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface INotesRepository {
  getNotes(packId: string): Promise<PackNote[]>;
  saveNote(note: PackNote): Promise<void>;
  deleteNote(id: string): Promise<void>;
}
