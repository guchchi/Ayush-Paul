import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthorityPackStoreState } from './types';
import { createWorkspaceSlice } from './slices/workspaceSlice';
import { createNotesSlice } from './slices/notesSlice';
import { createBookmarkSlice } from './slices/bookmarkSlice';
import { createProgressSlice } from './slices/progressSlice';
import { createReadingSlice } from './slices/readingSlice';
import { createGenerationSlice } from './slices/generationSlice';
import { createSessionSlice } from './slices/sessionSlice';
import { SCHEMA_VERSION, migrateSchema } from './migrations/schemaMigration';

export const useAuthorityPackStore = create<AuthorityPackStoreState>()(
  persist(
    (set, get, api) => ({
      ...createWorkspaceSlice(set, get, api),
      ...createNotesSlice(set, get, api),
      ...createBookmarkSlice(set, get, api),
      ...createProgressSlice(set, get, api),
      ...createReadingSlice(set, get, api),
      ...createGenerationSlice(set, get, api),
      ...createSessionSlice(set, get, api),
      
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      initialize: () => {
        // Initialization logic if needed
      },
      
      reset: () => {
        get().resetWorkspace();
        get().resetNotes();
        get().resetBookmarks();
        get().resetProgress();
        get().resetReading();
        get().resetGeneration();
        get().resetSession();
      }
    }),
    {
      name: 'authority-pack-storage',
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: migrateSchema,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
      partialize: (state) => ({
        // Persist only meaningful state as per user instructions
        notes: state.notes,
        bookmarks: state.bookmarks,
        completedActions: state.completedActions,
        readSections: state.readSections,
        preferences: state.preferences,
        
        // DO NOT persist: pack (from Firestore), loading/generation flags, activeSectionId (session)
      }),
    }
  )
);
