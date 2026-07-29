import { IRendererRegistry, ViewModel, BlockRendererProps } from './types';
import React from 'react';

/**
 * Singleton Registry that maps block types to their React components.
 * This is the Single Source of Truth for rendering decisions.
 */
class RendererRegistry implements IRendererRegistry {
  private renderers = new Map<string, React.ComponentType<BlockRendererProps<any>>>();

  register<T extends ViewModel>(type: string, component: React.ComponentType<BlockRendererProps<T>>): void {
    if (this.renderers.has(type)) {
      console.warn(`[RendererRegistry] Overwriting existing renderer for type: ${type}`);
    }
    // We safely cast because IRendererRegistry handles the consumer casting generic types
    this.renderers.set(type, component as React.ComponentType<BlockRendererProps<any>>);
  }

  get(type: string): React.ComponentType<BlockRendererProps<any>> | undefined {
    return this.renderers.get(type);
  }

  has(type: string): boolean {
    return this.renderers.has(type);
  }
}

export const registry = new RendererRegistry();
