import React, { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { cn } from '../../../lib/utils';
import { BookmarkButton } from '../../bookmarks/components/BookmarkButton';

interface NoteEditorProps {
  packId: string;
  blockId: string;
  className?: string;
}

export function NoteEditor({ packId, blockId, className }: NoteEditorProps) {
  const { note, saveNote, deleteNote, undoDelete, canUndo } = useNotes(packId, blockId);
  const [content, setContent] = useState(note?.content || '');
  const [isEditing, setIsEditing] = useState(false);

  // Sync content when external note changes
  useEffect(() => {
    if (note?.content !== undefined) {
      setContent(note.content);
    }
  }, [note?.content]);

  const handleSave = () => {
    if (content.trim()) {
      saveNote(content.trim());
      setIsEditing(false);
    } else if (note) {
      deleteNote();
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setContent(note?.content || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={cn("w-full mt-4 flex flex-col gap-2", className)}>
      {/* Header controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3" aria-live="polite">
          <BookmarkButton packId={packId} blockId={blockId} />
          {canUndo && !note && (
            <button 
              onClick={undoDelete}
              className="text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1"
            >
              Undo Delete Note
            </button>
          )}
        </div>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 rounded px-1"
            aria-label={note ? "Edit Note" : "Add Note"}
          >
            {note ? 'Edit Note' : 'Add Note'}
          </button>
        )}
      </div>

      {/* Editor Surface */}
      {(isEditing || note) && (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your note for this section..."
                className="w-full bg-transparent border-0 focus:ring-2 focus:ring-zinc-500 focus:outline-none p-2 text-sm text-zinc-800 dark:text-zinc-200 resize-none min-h-[100px] rounded"
                autoFocus
                aria-label="Note content"
              />
              <div className="flex items-center justify-end gap-2">
                {note && (
                  <button 
                    onClick={() => {
                      deleteNote();
                      setIsEditing(false);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors mr-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Delete Note"
                  >
                    Delete Note
                  </button>
                )}
                <button 
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                  aria-label="Cancel editing"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-3 py-1.5 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                  aria-label="Save Note"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="text-sm text-zinc-700 dark:text-zinc-300 p-2 whitespace-pre-wrap cursor-text"
              onClick={() => setIsEditing(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(true)}
              aria-label="Click to edit note"
            >
              {note?.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
