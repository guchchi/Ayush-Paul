/**
 * Domain handling utility for multi-domain production environment.
 * Primary Canonical Domain: ayushpaul.in
 * Backup/Preview Domain: ayushpaul.vercel.app
 */

export const DOMAINS = {
  PRIMARY: 'https://ayushpaul.in',
  VERCEL: 'https://ayushpaul.vercel.app',
};

/**
 * Gets the current base URL based on the environment.
 * Use this for dynamic logic that needs the current origin.
 */
export const getCurrentOrigin = () => {
  if (typeof window === 'undefined') return DOMAINS.PRIMARY;
  return window.location.origin;
};

/**
 * Normalizes a path to an absolute URL on the PRIMARY domain for SEO purposes.
 * This ensures that canonical tags, OG tags, and structured data always point to the brand domain.
 */
export const getCanonicalUrl = (path: string = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${DOMAINS.PRIMARY}${cleanPath}`;
};

/**
 * Checks if the current environment is the primary domain.
 */
export const isPrimaryDomain = () => {
  if (typeof window === 'undefined') return true;
  return window.location.hostname === 'ayushpaul.in';
};

/**
 * Detects if the current domain is a Vercel preview or backup domain.
 */
export const isVercelDomain = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.endsWith('.vercel.app');
};
