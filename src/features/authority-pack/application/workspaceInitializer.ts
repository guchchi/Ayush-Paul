import { useAuthorityPackStore } from '../store/useAuthorityPackStore';
import { IAuthorityPackRepository } from '../repositories';

export class WorkspaceInitializer {
  constructor(private packRepo: IAuthorityPackRepository) {}

  async initialize(packId: string): Promise<void> {
    const store = useAuthorityPackStore.getState();
    
    // 1. Load persisted state (Zustand Hydration happens automatically in React, but we wait for it)
    if (!store._hasHydrated) {
      await useAuthorityPackStore.persist.rehydrate();
    }

    // 2. Validate Schema / Migration (Handled inside store migrations automatically)
    // 3. Initialize Repositories (Injected via constructor)
    
    // 4. Restore Workspace
    const pack = await this.packRepo.get(packId);
    
    if (pack) {
      // Initialize UI State
      store.updateWorkspace({ pack });
    } else {
      console.log('Pack not found, starting fresh or handling error.');
      // Handle not found
    }
  }
}
