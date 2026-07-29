import { useState, useCallback, useEffect } from 'react';
import { useAuthorityPackStore } from '../../authority-pack/store/useAuthorityPackStore';
import { PackNote } from '../../authority-pack/types';
import { ServiceRegistry } from '../../authority-pack/services/ServiceRegistry';

export function useNotes(packId: string, sectionId: string) {
  const storeNotes = useAuthorityPackStore(state => state.notes);
  const addOrUpdateNote = useAuthorityPackStore(state => state.addOrUpdateNote);
  const removeNote = useAuthorityPackStore(state => state.removeNote);

  // Derive the note for this block
  const note = storeNotes.find(n => n.packId === packId && n.sectionId === sectionId);

  // We track the undo availability via standard React state to trigger re-renders 
  // when an item becomes pending or expires.
  const operationId = `note-${packId}-${sectionId}`;
  const [canUndo, setCanUndo] = useState(ServiceRegistry.undoManager.isPending(operationId));

  // Keep `canUndo` synced with the UndoManager. We can poll or just let the user actions set it,
  // but since UndoManager sets a timeout, we should sync via effect if we want it to hide automatically.
  // A cleaner way is letting the UndoManager accept an onComplete callback, or we can just use a simple timeout here to hide the UI.
  useEffect(() => {
    if (canUndo) {
      const timer = setTimeout(() => {
        setCanUndo(ServiceRegistry.undoManager.isPending(operationId));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [canUndo, operationId]);

  const saveNote = useCallback(async (content: string) => {
    let targetNote = note;
    if (targetNote) {
      targetNote = {
        ...targetNote,
        content,
        updatedAt: new Date().toISOString()
      };
    } else {
      targetNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        packId,
        sectionId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "1.0",
        author: "User"
      };
    }
    
    // Optimistic create/update
    addOrUpdateNote(targetNote);
    
    try {
      await ServiceRegistry.noteService.saveNote(targetNote);
    } catch (e) {
      // Delta Rollback (idempotent)
      if (!note) {
        // Was a creation, so remove it
        removeNote(targetNote.id);
      } else {
        // Was an update, restore the old note
        addOrUpdateNote(note);
      }
      console.error("Failed to save note:", e);
    }
  }, [note, packId, sectionId, addOrUpdateNote, removeNote]);

  const deleteNote = useCallback(async () => {
    if (!note) return;
    
    // Optimistic delete
    removeNote(note.id);
    
    // Schedule the deferred delete
    ServiceRegistry.undoManager.push({
      id: operationId,
      ttlMs: 5000,
      commit: async () => {
        setCanUndo(false);
        try {
          await ServiceRegistry.noteService.deleteNote(note.id);
        } catch (e) {
          // If real delete fails, rollback (restore in store)
          addOrUpdateNote(note);
          console.error("Failed to delete note:", e);
        }
      },
      rollback: () => {
        // User clicked undo: restore the note in the UI
        addOrUpdateNote(note);
        setCanUndo(false);
      }
    });
    
    setCanUndo(true);
  }, [note, operationId, removeNote, addOrUpdateNote]);

  const undoDelete = useCallback(() => {
    if (ServiceRegistry.undoManager.undo(operationId)) {
      setCanUndo(false);
    }
  }, [operationId]);

  // Flush pending deletes when navigating away
  useEffect(() => {
    return () => {
      if (ServiceRegistry.undoManager.isPending(operationId)) {
        ServiceRegistry.undoManager.commit(operationId);
      }
    };
  }, [operationId]);

  return {
    note,
    saveNote,
    deleteNote,
    undoDelete,
    canUndo
  };
}
