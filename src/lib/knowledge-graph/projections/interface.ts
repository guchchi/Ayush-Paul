import { BaseNode } from '../core/types';
import { IGraphRepository } from '../repositories/interface';
import { IContentRepository, ContentDoc } from '../content/loader';

export interface NavigationBreadcrumb {
  title: string;
  slug: string;
  nodeId: string;
  type: string;
}

export interface SidebarItem {
  nodeId: string;
  title: string;
  slug: string;
  type: string;
  order?: number;
  isActive: boolean;
  children?: SidebarItem[];
}

export interface NodeNavigationViewModel {
  breadcrumbs: NavigationBreadcrumb[];
  sidebar: SidebarItem[];
  previous?: { title: string; slug: string; nodeId: string };
  next?: { title: string; slug: string; nodeId: string };
  prerequisites: { title: string; slug: string; nodeId: string }[];
  relatedAssets: { title: string; slug: string; nodeId: string; type: string }[];
  metrics: {
    readingTimeMinutes: number;
    totalSteps: number;
    completedSteps: number;
    assetCount: number;
  };
}

export interface IProjection<TResult> {
  project(nodeId: string, repo: IGraphRepository, contentRepo?: IContentRepository): Promise<TResult | null>;
}
