import React from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { cn } from '../../../lib/utils';

interface BookmarkButtonProps {
  packId: string;
  blockId: string;
  className?: string;
}

export function BookmarkButton({ packId, blockId, className }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, undoRemove, canUndo } = useBookmarks(packId, blockId);

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <button 
        onClick={toggleBookmark}
        className={cn(
          "p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          isBookmarked 
            ? "text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50" 
            : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
        aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
        aria-pressed={isBookmarked}
        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={isBookmarked ? "currentColor" : "none"} 
          stroke="currentColor" 
          className="w-5 h-5"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      {canUndo && !isBookmarked && (
        <button 
          onClick={undoRemove}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
          aria-live="polite"
        >
          Undo Remove
        </button>
      )}
    </div>
  );
}
