export type OSObjectStatus = 'draft' | 'review' | 'published' | 'archived';
export type OSObjectStability = 'experimental' | 'stable' | 'deprecated';

export interface ILifecycle {
  status: OSObjectStatus;
  reviewStatus?: 'peer-reviewed' | 'pending' | 'needs-update';
  stability: OSObjectStability;
  deprecated: boolean;
  replacementUuid?: string;
  createdAt: string;
  lastValidatedAt?: string;
  nextReviewAt?: string;
}

export interface IProvenance {
  source: string;
  author: string;
  version: string;
  researchBasis?: string;
}

export interface IOsObject {
  uuid: string;
  id: string; // human-readable ID
  type: string;
  lifecycle: ILifecycle;
  capabilities: string[]; // references capability graph node UUIDs or slugs
}

// 1. EIO (Knowledge)
export interface IEIO extends IOsObject {
  type: 'eio';
  provenance: IProvenance;
  education: {
    coreConcept: string;
    explanations: Record<string, string>; // e.g. beginner, advanced
    mentalModels?: string[];
    commonMistakes?: string[];
  };
  signals: {
    success: string[];
    failure: string[];
  };
}

// 2. XIO (Execution)
export interface IXIO extends IOsObject {
  type: 'xio';
  linkedEioUuid: string;
  workflow: {
    objective: string;
    inputs: string[];
    outputs: string[];
  };
  practice: {
    prompt: string;
    hints?: string[];
  };
  failureHandling?: {
    failureModes: Array<{
      mode: string;
      recoverySteps: string[];
    }>;
  };
}

// 3. AIO (Assessment)
export interface IAIO extends IOsObject {
  type: 'aio';
  linkedEioUuid: string;
  assessment: {
    scenarios: Array<{
      context: string;
      question: string;
      expectedAnswerConcept?: string;
    }>;
    rubrics: string[];
    passThreshold: number; // 0.0 - 1.0
  };
  completion: {
    observableBehaviors: string[];
    feedbackMapping?: {
      passed: string;
      failed: string;
    };
  };
}

// 4. EDO (Decision)
export interface IEDO extends IOsObject {
  type: 'edo';
  condition: {
    rules: Array<{
      field: string;
      operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
      value: any;
    }>;
  };
  decision: string;
  explainability: {
    explanation: string;
    evidence: string;
    tradeoffs: string[];
    alternatives: string[]; // EDO uuids
    confidenceScore: number;
    missingInformation?: string[];
  };
  outputs: {
    prioritizeUuids: string[];
  };
}

// 5. Relationship Layer (Graph Edges)
export interface IGraphEdge {
  uuid: string;
  sourceUuid: string;
  targetUuid: string;
  relationType: 'requires' | 'supports' | 'extends' | 'contradicts' | 'alternative' | 'child_concept';
  weight: number; // 0.0 - 1.0
}

// 6. Recommendation Layer (Paths)
export interface IRecommendationPath extends IOsObject {
  type: 'path';
  mastery: {
    currentMastery: 'Awareness' | 'Understanding' | 'Application' | 'Mastery';
    targetMastery: 'Awareness' | 'Understanding' | 'Application' | 'Mastery';
    estimatedEffortHours?: number;
  };
  sequenceUuids: string[];
}

// 7. Validation Layer
export interface IValidationObject extends IOsObject {
  type: 'validation';
  linkedXioUuid: string;
  schema: string; // reference to Zod schema or JSON schema
  constraints?: string[];
  aiReview?: {
    reviewRules: string[];
  };
}

// 8. AI Layer
export interface IAiConfig extends IOsObject {
  type: 'ai-config';
  linkedEioUuid: string;
  promptConfig: {
    allowedVariables: string[];
    toneRules: string[];
  };
}

// 9. Intelligence Layer (Telemetry)
export interface ITelemetryRecord {
  objectId: string; // The UUID of the EIO/XIO being tracked
  successRate: number;
  dropoffRate?: number;
  avgCompletionTimeMinutes?: number;
  lastUpdated: string;
}
