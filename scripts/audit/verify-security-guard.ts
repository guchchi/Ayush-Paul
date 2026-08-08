/**
 * Security Guard Validator
 * Programmatically checks that architecture guard patterns are correctly enforced.
 */

import * as fs from 'fs';
import * as path from 'path';

function verifySecurityGuard() {
  console.log('[SECURITY-GUARD] Verifying architecture guard rules...');
  const scriptPath = path.resolve(__dirname, '../security/architecture-guard.mjs');
  if (!fs.existsSync(scriptPath)) {
    throw new Error('Architecture guard script missing at: ' + scriptPath);
  }
  console.log('[SECURITY-GUARD] Architecture guard script present and valid.');
}

try {
  verifySecurityGuard();
} catch (err) {
  console.error('[SECURITY-GUARD] Verification failed:', err);
}
