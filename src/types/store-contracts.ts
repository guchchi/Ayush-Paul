/**
 * Common Store Contract Interfaces
 * Defines standard interfaces for Zustand persistent store state & actions.
 */

export interface ResettableStore {
  reset: () => void;
}

export interface VersionedStoreState {
  _version?: number;
}

export interface StoreMigrationRule<T> {
  fromVersion: number;
  toVersion: number;
  migrate: (persistedState: unknown) => T;
}
