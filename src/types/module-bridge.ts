/**
 * Module Bridge Interface Definitions
 * Defines context passing interfaces between consecutive workspace modules.
 */

export interface ModuleBridgeContext {
  moduleId: string;
  timestamp: string;
  fingerprint: string;
  payload: Record<string, unknown>;
}

export interface ModuleBridgeAdapter<T> {
  adapt(context: ModuleBridgeContext): T;
  validate(context: ModuleBridgeContext): boolean;
}
