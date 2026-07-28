export const AUTHORITY_PACK_CONSTANTS = {
  VERSION: '1.0',
  MAX_PILLARS: 5,
  MAX_ACTION_ITEMS: 10,
  STATUS: {
    DRAFT: 'draft',
    GENERATING: 'generating',
    READY: 'ready',
    ERROR: 'error'
  } as const,
  PRIORITY: {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  } as const
};

export const ERROR_MESSAGES = {
  GENERATION_FAILED: 'Failed to generate Authority Pack. Please try again.',
  INVALID_STATE: 'Authority Pack is in an invalid state.',
  VALIDATION_FAILED: 'Authority Pack failed validation.',
};
