/**
 * Core Types for Authority Pack Feature
 */

export type PackStatus = 'draft' | 'generating' | 'ready' | 'error';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type ActionItemStatus = 'pending' | 'in-progress' | 'completed';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------
// DOMAIN MODELS
// ---------------------------------------------------------

export interface ExecutiveSummary {
  strategyOverview: string;
  keyInsight: string;
  primaryRecommendation: string;
  readingGuidance: string;
}

export interface StrategicPillar extends BaseEntity {
  title: string;
  description: string;
  rationale: string;
}

export interface ActionItem extends BaseEntity {
  title: string;
  description: string;
  priority: PriorityLevel;
  status: ActionItemStatus;
}

export interface AuthorityPackDomain extends BaseEntity {
  version: string;
  status: PackStatus;
  executiveSummary: ExecutiveSummary | null;
  strategicPillars: StrategicPillar[];
  actionPlan: ActionItem[];
}

export interface PackNote extends BaseEntity {
  packId: string;
  sectionId: string;
  content: string;
  author?: string;
  source?: string;
  version?: string;
}

export interface PackBookmark extends BaseEntity {
  bookmarkId: string;
  packId: string;
  sectionId: string;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

// ---------------------------------------------------------
// DTOs (Persistence Layer)
// ---------------------------------------------------------

export interface AuthorityPackDTO {
  id: string;
  version: string;
  status: PackStatus;
  createdAt: string;
  updatedAt: string;
  executiveSummary: {
    strategyOverview: string;
    keyInsight: string;
    primaryRecommendation: string;
    readingGuidance: string;
  } | null;
  strategicPillars: Array<{
    id: string;
    title: string;
    description: string;
    rationale: string;
    createdAt: string;
    updatedAt: string;
  }>;
  actionPlan: Array<{
    id: string;
    title: string;
    description: string;
    priority: PriorityLevel;
    status: ActionItemStatus;
    createdAt: string;
    updatedAt: string;
  }>;
}

// ---------------------------------------------------------
// VIEW MODELS (UI Layer)
// ---------------------------------------------------------

export interface AuthorityPackViewModel {
  id: string;
  displayTitle: string;
  statusBadge: string;
  lastUpdatedFormatted: string;
  isReady: boolean;
  isGenerating: boolean;
  executiveSummary: ExecutiveSummary | null;
  strategicPillars: StrategicPillar[];
  actionPlan: ActionItem[];
  completedActionsCount: number;
  totalActionsCount: number;
  progressPercentage: number;
}
