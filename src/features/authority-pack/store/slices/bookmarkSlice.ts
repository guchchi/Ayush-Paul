import { StateCreator } from 'zustand';
import { AuthorityPackStoreState, BookmarkSlice } from '../types';

const initialBookmarkState = {
  bookmarks: [],
};

export const createBookmarkSlice: StateCreator<
  AuthorityPackStoreState,
  [],
  [],
  BookmarkSlice
> = (set) => ({
  ...initialBookmarkState,
  updateBookmarks: (bookmarks) => set({ bookmarks }),
  resetBookmarks: () => set(initialBookmarkState),
});
