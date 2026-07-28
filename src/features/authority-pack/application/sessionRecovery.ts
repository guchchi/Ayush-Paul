import { useAuthorityPackStore } from '../store/useAuthorityPackStore';
import { IAuthorityPackRepository } from '../repositories';
import { PackStatus } from '../types';

export class SessionRecovery {
  constructor(private packRepo: IAuthorityPackRepository) {}

  async recoverPendingSession(packId: string): Promise<void> {
    const store = useAuthorityPackStore.getState();
    
    // Check if we were interrupted during a generation
    if (store.isGenerating) {
      const remotePack = await this.packRepo.get(packId);
      
      if (remotePack && remotePack.status === 'ready') {
        // Generation finished remotely while user was disconnected!
        store.updateGeneration({ isGenerating: false, error: null });
        store.updateWorkspace({ pack: remotePack });
      } else if (remotePack && remotePack.status === 'error') {
        // Remote generation failed
        store.updateGeneration({ isGenerating: false, error: 'Remote generation failed during disconnection.' });
      } else {
        // Remote generation still running? Need to connect to listeners/websockets (handled in GenerationCoordinator)
      }
    }
  }
}
