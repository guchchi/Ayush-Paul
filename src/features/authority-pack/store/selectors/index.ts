import { AuthorityPackStoreState } from '../types';

export const useCurrentPack = (state: AuthorityPackStoreState) => state.pack;
export const useReadingProgress = (state: AuthorityPackStoreState) => state.readSections;
export const useNotes = (state: AuthorityPackStoreState) => state.notes;
export const useBookmarks = (state: AuthorityPackStoreState) => state.bookmarks;
export const useCompletedActions = (state: AuthorityPackStoreState) => state.completedActions;

export const useIsSectionBookmarked = (sectionId: string) => (state: AuthorityPackStoreState) => 
  state.bookmarks.some(b => b.sectionId === sectionId);

export const useNotesForSection = (sectionId: string) => (state: AuthorityPackStoreState) =>
  state.notes.filter(n => n.sectionId === sectionId);

export const useActionProgressPercentage = (state: AuthorityPackStoreState) => {
  if (!state.pack || state.pack.actionPlan.length === 0) return 0;
  return Math.round((state.completedActions.length / state.pack.actionPlan.length) * 100);
};

export const useHasHydrated = (state: AuthorityPackStoreState) => state._hasHydrated;
