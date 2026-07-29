import { IBookmarkService } from './IBookmarkService';
import { PackBookmark } from '../../authority-pack/types';

export class BookmarkService implements IBookmarkService {
  public async addBookmark(bookmark: PackBookmark): Promise<void> {
    // Mock persistence
    console.log('Saved bookmark to remote/local storage:', bookmark);
    return Promise.resolve();
  }

  public async removeBookmark(bookmarkId: string): Promise<void> {
    // Mock persistence
    console.log('Deleted bookmark from remote/local storage:', bookmarkId);
    return Promise.resolve();
  }
}
