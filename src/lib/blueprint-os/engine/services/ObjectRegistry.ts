import { IObjectRegistry, IPluginManifest, IOsObject } from '../types';

export class ObjectRegistry implements IObjectRegistry {
  private static instance: ObjectRegistry;
  
  // Mapping of UUID to the actual OS Object
  private objects: Map<string, IOsObject>;
  
  // Mapping of Capability slug to a set of UUIDs
  private capabilityIndex: Map<string, Set<string>>;

  // Loaded plugins/packs
  private manifests: Map<string, IPluginManifest>;

  private constructor() {
    this.objects = new Map();
    this.capabilityIndex = new Map();
    this.manifests = new Map();
  }

  public static getInstance(): ObjectRegistry {
    if (!ObjectRegistry.instance) {
      ObjectRegistry.instance = new ObjectRegistry();
    }
    return ObjectRegistry.instance;
  }

  /**
   * Registers a domain pack directly using its manifest and objects payload.
   */
  public registerPack(manifest: IPluginManifest, objects: IOsObject[]): void {
    if (this.manifests.has(manifest.name)) {
      console.warn(`[Blueprint OS] Pack ${manifest.name} is already registered. Overwriting.`);
    }

    this.manifests.set(manifest.name, manifest);

    let registeredCount = 0;
    for (const obj of objects) {
      if (this.objects.has(obj.uuid)) {
        console.warn(`[Blueprint OS] Object collision: UUID ${obj.uuid} already exists. Skipping.`);
        continue;
      }
      
      this.objects.set(obj.uuid, obj);
      
      // Index by capabilities
      if (obj.capabilities && Array.isArray(obj.capabilities)) {
        for (const cap of obj.capabilities) {
          if (!this.capabilityIndex.has(cap)) {
            this.capabilityIndex.set(cap, new Set());
          }
          this.capabilityIndex.get(cap)!.add(obj.uuid);
        }
      }
      registeredCount++;
    }

    console.info(`[Blueprint OS] Registered Pack: ${manifest.name} v${manifest.version} (${registeredCount} objects)`);
  }

  /**
   * Retrieves an object by its stable UUID.
   */
  public getObjectByUuid<T extends IOsObject>(uuid: string): T | null {
    const obj = this.objects.get(uuid);
    return obj ? (obj as T) : null;
  }

  /**
   * Retrieves all objects tagged with a specific capability.
   */
  public getObjectsByCapability<T extends IOsObject>(capability: string): T[] {
    const uuids = this.capabilityIndex.get(capability);
    if (!uuids) return [];

    const result: T[] = [];
    uuids.forEach(uuid => {
      const obj = this.objects.get(uuid);
      if (obj) result.push(obj as T);
    });
    
    return result;
  }

  /**
   * Resets the registry (useful for tests)
   */
  public clear(): void {
    this.objects.clear();
    this.capabilityIndex.clear();
    this.manifests.clear();
  }
}
