/**
 * Store Reset Contract Verification Script
 * Validates that all workspace stores implement the reset() function contract.
 */

import { useOpportunityMapStore } from '../../src/lib/opportunity-map';
import { useOfferEngineeringStore } from '../../src/lib/offer-engineering';
import { useModule3Store } from '../../src/lib/module3';
import { usePortfolioSystemStore } from '../../src/lib/portfolio-system';
import { useClientPipelineStore } from '../../src/lib/client-pipeline-system';
import { useOutreachEngineStore } from '../../src/lib/outreach-engine-system';

function verifyAllStoreResets() {
  console.log('[VERIFY-STORES] Auditing reset() implementation across all 6 workspace stores...');
  
  const stores = [
    { name: 'Module 1 (useOpportunityMapStore)', store: useOpportunityMapStore },
    { name: 'Module 2 (useOfferEngineeringStore)', store: useOfferEngineeringStore },
    { name: 'Module 3 (useModule3Store)', store: useModule3Store },
    { name: 'Module 4 (usePortfolioSystemStore)', store: usePortfolioSystemStore },
    { name: 'Module 5 (useClientPipelineStore)', store: useClientPipelineStore },
    { name: 'Module 6 (useOutreachEngineStore)', store: useOutreachEngineStore },
  ];

  for (const item of stores) {
    const state = item.store.getState() as any;
    if (typeof state.reset !== 'function') {
      throw new Error(`Store ${item.name} is missing reset() method`);
    }
    console.log(`[VERIFY-STORES] ✅ ${item.name} implements reset().`);
  }
  
  console.log('[VERIFY-STORES] All 6 workspace stores passed reset() validation.');
}

try {
  verifyAllStoreResets();
} catch (err) {
  console.error('[VERIFY-STORES] Verification failed:', err);
}
