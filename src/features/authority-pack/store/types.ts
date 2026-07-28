import { AuthorityPackDomain, PackNote, PackBookmark } from '../types';

export interface WorkspaceSlice {
  pack: AuthorityPackDomain | null;
  preferences: Record<string, string>;
  updateWorkspace: (updates: Partial<Pick<WorkspaceSlice, 'pack' | 'preferences'>>) => void;
  resetWorkspace: () => void;
}

export interface NotesSlice {
  notes: PackNote[];
  updateNotes: (notes: PackNote[]) => void;
  resetNotes: () => void;
}

export interface BookmarkSlice {
  bookmarks: PackBookmark[];
  updateBookmarks: (bookmarks: PackBookmark[]) => void;
  resetBookmarks: () => void;
}

export interface ProgressSlice {
  completedActions: string[];
  updateProgress: (completedActions: string[]) => void;
  resetProgress: () => void;
}

export interface ReadingSlice {
  readSections: string[];
  updateReading: (readSections: string[]) => void;
  resetReading: () => void;
}

export interface GenerationSlice {
  isGenerating: boolean;
  error: string | null;
  updateGeneration: (updates: Partial<Pick<GenerationSlice, 'isGenerating' | 'error'>>) => void;
  resetGeneration: () => void;
}

export interface SessionSlice {
  activeSectionId: string | null;
  updateSession: (updates: Partial<Pick<SessionSlice, 'activeSectionId'>>) => void;
  resetSession: () => void;
}

export interface AuthorityPackStoreState extends
  WorkspaceSlice,
  NotesSlice,
  BookmarkSlice,
  ProgressSlice,
  ReadingSlice,
  GenerationSlice,
  SessionSlice {
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    initialize: () => void;
    reset: () => void;
}
