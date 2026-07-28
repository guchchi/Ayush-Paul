export const SCHEMA_VERSION = 1;

export function migrateSchema(persistedState: any, version: number): any {
  let state = { ...persistedState };
  
  if (version < 1) {
    // Initial setup, nothing to migrate yet.
  }
  
  return state;
}
