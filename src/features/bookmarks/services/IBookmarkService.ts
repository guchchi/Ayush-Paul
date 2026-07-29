import { PackBookmark } from '../../authority-pack/types';

export interface IBookmarkService {
  /**
   * Saves a bookmark.
   */
  addBookmark(bookmark: PackBookmark): Promise<void>;

  /**
   * Deletes a bookmark by its ID.
   */
  removeBookmark(bookmarkId: string): Promise<void>;
}
