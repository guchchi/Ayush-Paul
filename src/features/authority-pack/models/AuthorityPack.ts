import type { AuthorityPackDomain, PackStatus } from '../types';

/**
 * Domain Model Factory & Business Rules
 * Keeps business logic separated from state and UI.
 */
export const AuthorityPack = {
  createDefault(): AuthorityPackDomain {
    return {
      id: crypto.randomUUID(),
      version: '1.0',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executiveSummary: null,
      strategicPillars: [],
      actionPlan: []
    };
  },

  isComplete(pack: AuthorityPackDomain): boolean {
    return pack.status === 'ready' 
      && pack.executiveSummary !== null 
      && pack.strategicPillars.length > 0 
      && pack.actionPlan.length > 0;
  },

  updateStatus(pack: AuthorityPackDomain, status: PackStatus): AuthorityPackDomain {
    return {
      ...pack,
      status,
      updatedAt: new Date().toISOString()
    };
  }
};
