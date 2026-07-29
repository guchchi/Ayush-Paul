export interface UndoableOperation {
  id: string; // Unique operation ID
  commit: () => Promise<void>;
  rollback: () => void;
  ttlMs?: number; // Time to live in ms (defaults to 5000)
}

/**
 * An application-scoped service for managing deferred operations that can be undone.
 */
export class UndoManager {
  private pendingOperations = new Map<string, {
    operation: UndoableOperation;
    timeoutId: NodeJS.Timeout;
  }>();

  /**
   * Pushes an operation to the undo queue.
   * If an operation with the same ID already exists, it is committed immediately
   * before the new one is added, ensuring no race conditions on the same entity.
   */
  public push(operation: UndoableOperation): void {
    // If there's already an operation pending for this ID, commit it now.
    if (this.pendingOperations.has(operation.id)) {
      this.commit(operation.id);
    }

    const ttl = operation.ttlMs || 5000;
    
    const timeoutId = setTimeout(() => {
      this.commit(operation.id);
    }, ttl);

    this.pendingOperations.set(operation.id, {
      operation,
      timeoutId
    });
  }

  /**
   * Undoes a pending operation.
   */
  public undo(operationId: string): boolean {
    const pending = this.pendingOperations.get(operationId);
    if (!pending) {
      return false;
    }

    clearTimeout(pending.timeoutId);
    pending.operation.rollback();
    this.pendingOperations.delete(operationId);
    
    return true;
  }

  /**
   * Immediately commits a pending operation.
   */
  public commit(operationId: string): boolean {
    const pending = this.pendingOperations.get(operationId);
    if (!pending) {
      return false;
    }

    clearTimeout(pending.timeoutId);
    this.pendingOperations.delete(operationId);
    
    // Execute commit and catch any errors so it doesn't crash the manager
    pending.operation.commit().catch(e => {
      console.error(`Failed to commit operation ${operationId}:`, e);
    });

    return true;
  }

  /**
   * Returns true if the operation is currently pending.
   */
  public isPending(operationId: string): boolean {
    return this.pendingOperations.has(operationId);
  }

  /**
   * Force commits all pending operations. Useful for cleanup (e.g. unmount or navigation).
   */
  public flush(): void {
    for (const id of Array.from(this.pendingOperations.keys())) {
      this.commit(id);
    }
  }

  /**
   * Drops all pending operations without committing or rolling back.
   * Useful when tearing down a workspace.
   */
  public clear(): void {
    for (const pending of this.pendingOperations.values()) {
      clearTimeout(pending.timeoutId);
    }
    this.pendingOperations.clear();
  }
}
