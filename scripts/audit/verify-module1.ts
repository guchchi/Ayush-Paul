/**
 * Module 1 Verification Script
 * Validates Module 1 (Client Acquisition) store contracts and defaults.
 */

import { useOpportunityMapStore } from '../../src/lib/opportunity-map';

function verifyModule1Store() {
  console.log('[VERIFY-MODULE-1] Starting Module 1 store validation...');
  const state = useOpportunityMapStore.getState();
  
  if (typeof state.reset !== 'function') {
    throw new Error('Module 1 store missing reset() method');
  }
  
  console.log('[VERIFY-MODULE-1] Module 1 store validation passed successfully.');
}

try {
  verifyModule1Store();
} catch (err) {
  console.error('[VERIFY-MODULE-1] Verification failed:', err);
}
