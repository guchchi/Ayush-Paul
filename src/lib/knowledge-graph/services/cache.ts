import { BaseNode, BaseEdge } from '../core/types';

export class GraphCache {
  private static instance: GraphCache;
  private nodeCache = new Map<string, BaseNode>();
  private projectionCache = new Map<string, { timestamp: number; data: any }>();
  private seoCache = new Map<string, { timestamp: number; data: any }>();
  private ttlMs: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): GraphCache {
    if (!GraphCache.instance) {
      GraphCache.instance = new GraphCache();
    }
    return GraphCache.instance;
  }

  getProjection<T>(key: string): T | null {
    const cached = this.projectionCache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.ttlMs) {
      this.projectionCache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  setProjection<T>(key: string, data: T): void {
    this.projectionCache.set(key, { timestamp: Date.now(), data });
  }

  getSeo<T>(key: string): T | null {
    const cached = this.seoCache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.ttlMs) {
      this.seoCache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  setSeo<T>(key: string, data: T): void {
    this.seoCache.set(key, { timestamp: Date.now(), data });
  }

  clear(): void {
    this.nodeCache.clear();
    this.projectionCache.clear();
    this.seoCache.clear();
  }
}
