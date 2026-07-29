import React from 'react';

/**
 * A generic ViewModel that represents any block of data to be rendered.
 * It contains a standard `type` discriminator and a unique `id`.
 */
export interface ViewModel {
  id: string;
  type: string;
  [key: string]: any;
}

/**
 * Props for any component that renders a block.
 */
export interface BlockRendererProps<T extends ViewModel = ViewModel> {
  block: T;
  index: number;
}

/**
 * A registry that maps a view model's `type` to a React component.
 */
export interface IRendererRegistry {
  register<T extends ViewModel>(type: string, component: React.ComponentType<BlockRendererProps<T>>): void;
  get(type: string): React.ComponentType<BlockRendererProps<any>> | undefined;
  has(type: string): boolean;
}
