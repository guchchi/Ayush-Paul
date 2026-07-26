/**
 * Simple object hash function for caching contexts.
 */
export async function hashObject(obj: any): Promise<string> {
  const str = JSON.stringify(obj);
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Deep merge utility to preserve user edits.
 * Merges source into target. If source has a primitive, it overwrites target's primitive unless we apply specific provenance rules.
 * For our specific use case, we merge the generated output (target) and overwrite with the user-edited fields (source).
 */
export function deepMergePreserve<T>(generated: any, editsToPreserve: any): T {
  if (!editsToPreserve || typeof editsToPreserve !== 'object') {
    return generated;
  }

  if (Array.isArray(generated) && Array.isArray(editsToPreserve)) {
    // For arrays, if the user edited the array, we typically take the user's version wholesale
    // rather than trying to merge item by item, which gets messy without IDs.
    return editsToPreserve as unknown as T;
  }

  const result = { ...generated };
  for (const key of Object.keys(editsToPreserve)) {
    const editValue = editsToPreserve[key];
    if (editValue !== undefined) {
      if (typeof editValue === 'object' && editValue !== null && !Array.isArray(editValue)) {
        result[key] = deepMergePreserve(result[key] || {}, editValue);
      } else {
        result[key] = editValue;
      }
    }
  }
  return result as T;
}
