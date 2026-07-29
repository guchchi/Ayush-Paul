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
  addBookmark: (bookmark) => set((state) => {
    if (state.bookmarks.some(b => b.bookmarkId === bookmark.bookmarkId)) return state;
    return { bookmarks: [...state.bookmarks, bookmark] };
  }),
  removeBookmark: (id) => set((state) => ({
    bookmarks: state.bookmarks.filter(b => b.bookmarkId !== id && b.id !== id)
  })),
  resetBookmarks: () => set(initialBookmarkState),
});
