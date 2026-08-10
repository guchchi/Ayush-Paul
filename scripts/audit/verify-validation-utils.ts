/**
 * Validation Utilities Unit Verification
 */

import { isValidEmail, isValidUrl, isValidPhoneNumber } from '../../src/lib/validation-utils';

function testValidationUtils() {
  console.log('[VERIFY-VALIDATION] Testing input validation helpers...');
  
  if (!isValidEmail('user@example.com')) throw new Error('Valid email failed');
  if (isValidEmail('invalid-email')) throw new Error('Invalid email passed');
  
  if (!isValidUrl('https://ayushpaul.com')) throw new Error('Valid URL failed');
  if (isValidUrl('not-a-url')) throw new Error('Invalid URL passed');
  
  if (!isValidPhoneNumber('+919876543210')) throw new Error('Valid phone failed');
  
  console.log('[VERIFY-VALIDATION] ✅ All validation utility tests passed.');
}

try {
  testValidationUtils();
} catch (err) {
  console.error('[VERIFY-VALIDATION] Verification failed:', err);
}
