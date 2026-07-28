import { IEIO, IXIO, IAIO, IEDO, IOsObject } from './objects';

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
  registerPack(manifest: IPluginManifest, objects: IOsObject[]): void;
  getObjectByUuid<T extends IOsObject>(uuid: string): T | null;
  getObjectsByCapability<T extends IOsObject>(capability: string): T[];
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
