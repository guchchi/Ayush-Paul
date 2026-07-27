import { IEIO, IXIO, IAIO, IEDO } from './objects';

// Manifest definition for Domain Packs
export interface IPluginManifest {
  name: string;
  version: string;
  compatibleEngine: string; // semver (e.g. '>=1.0.0')
  capabilities: number;
  objects: {
    eio: number;
    xio: number;
    aio: number;
    edo: number;
    [key: string]: number;
  };
}

// Core Engine Interfaces
export interface IObjectRegistry {
  registerPack(manifestPath: string, objects: any[]): void;
  getObjectByUuid<T>(uuid: string): T | null;
  getObjectsByCapability(capability: string): any[];
}

export interface IKnowledgeProvider {
  getEIO(uuid: string): IEIO | null;
  getXIO(uuid: string): IXIO | null;
  getAIO(uuid: string): IAIO | null;
  queryCapabilities(capability: string): IEIO[];
}

export interface IDecisionProvider {
  evaluateEDOs(context: Record<string, any>): IEDO[];
}

export interface IIntelligenceProvider {
  getConfidenceWeight(uuid: string): number;
  recordTelemetry(uuid: string, event: 'success' | 'failure' | 'start', durationMinutes?: number): void;
}
