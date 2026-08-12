/**
 * Storage Utilities Verification Script
 */

import { getSafeLocalStorage, setSafeLocalStorage } from '../../src/lib/storage-utils';

function testStorageUtils() {
  console.log('[VERIFY-STORAGE] Testing storage utility fallback behavior...');
  
  const fallback = { test: true };
  const val = getSafeLocalStorage('non_existent_key_123', fallback);
  
  if (val !== fallback) {
    throw new Error('Storage fallback failed');
  }
  
  console.log('[VERIFY-STORAGE] ✅ Storage utility tests passed.');
}

try {
  testStorageUtils();
} catch (err) {
  console.error('[VERIFY-STORAGE] Verification failed:', err);
}
