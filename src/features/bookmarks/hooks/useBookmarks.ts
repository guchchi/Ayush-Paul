import { useState, useCallback, useEffect } from 'react';
import { useAuthorityPackStore } from '../../authority-pack/store/useAuthorityPackStore';
import { PackBookmark } from '../../authority-pack/types';
import { ServiceRegistry } from '../../authority-pack/services/ServiceRegistry';

export function useBookmarks(packId: string, sectionId: string) {
  const storeBookmarks = useAuthorityPackStore(state => state.bookmarks);
  const addBookmarkToStore = useAuthorityPackStore(state => state.addBookmark);
  const removeBookmarkFromStore = useAuthorityPackStore(state => state.removeBookmark);

  const bookmark = storeBookmarks.find(b => b.packId === packId && b.sectionId === sectionId);
  const isBookmarked = !!bookmark;

  const operationId = `bookmark-${packId}-${sectionId}`;
  const [canUndo, setCanUndo] = useState(ServiceRegistry.undoManager.isPending(operationId));

  useEffect(() => {
    if (canUndo) {
      const timer = setTimeout(() => {
        setCanUndo(ServiceRegistry.undoManager.isPending(operationId));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [canUndo, operationId]);

  const toggleBookmark = useCallback(async () => {
    if (isBookmarked && bookmark) {
      // Remove Bookmark
      removeBookmarkFromStore(bookmark.bookmarkId);

      ServiceRegistry.undoManager.push({
        id: operationId,
        ttlMs: 5000,
        commit: async () => {
          setCanUndo(false);
          try {
            await ServiceRegistry.bookmarkService.removeBookmark(bookmark.bookmarkId);
          } catch (e) {
            addBookmarkToStore(bookmark);
            console.error("Failed to remove bookmark:", e);
          }
        },
        rollback: () => {
          addBookmarkToStore(bookmark);
          setCanUndo(false);
        }
      });
      setCanUndo(true);
    } else {
      // Add Bookmark
      const newBookmark: PackBookmark = {
        bookmarkId: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        id: `bm-${Date.now()}`,
        packId,
        sectionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        label: "Saved Section"
      };
      
      addBookmarkToStore(newBookmark);
      
      try {
        await ServiceRegistry.bookmarkService.addBookmark(newBookmark);
      } catch (e) {
        removeBookmarkFromStore(newBookmark.bookmarkId);
        console.error("Failed to add bookmark:", e);
      }
    }
  }, [isBookmarked, bookmark, packId, sectionId, addBookmarkToStore, removeBookmarkFromStore, operationId]);

  const undoRemove = useCallback(() => {
    if (ServiceRegistry.undoManager.undo(operationId)) {
      setCanUndo(false);
    }
  }, [operationId]);

  useEffect(() => {
    return () => {
      if (ServiceRegistry.undoManager.isPending(operationId)) {
        ServiceRegistry.undoManager.commit(operationId);
      }
    };
  }, [operationId]);

  return {
    isBookmarked,
    toggleBookmark,
    undoRemove,
    canUndo
  };
}
