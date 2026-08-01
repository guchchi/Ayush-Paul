export type NodeId = string;
export type RevisionId = string;
export type EdgeId = string;

export type LanguageCode = 'en' | 'es' | 'hi';
export type LocalizedString = Record<LanguageCode, string>;

export interface NodeMetadata {
  createdBy: string;
  updatedBy: string;
  source: 'HUMAN_AUTHOR' | 'AI_AGENT' | 'SYSTEM_IMPORT';
  confidence: number; // 0.0 to 1.0
  visibility: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED';
  checksum: string; // SHA-256 content hash
}

export interface BaseNode<TProperties = Record<string, any>> {
  nodeId: NodeId;
  revisionId: RevisionId;
  nodeType: string;
  version: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  title: LocalizedString;
  slug: LocalizedString;
  description?: LocalizedString;
  properties: TProperties;
  metadata: NodeMetadata;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BaseEdge {
  edgeId: EdgeId;
  sourceId: NodeId;
  targetId: NodeId;
  relationType: string;
  weight: number; // 0.0 to 1.0
  anchorText?: LocalizedString;
  reason?: string;
  metadata: NodeMetadata;
  createdAt: string;
  updatedAt: string;
}

export type GraphEvent = 
  | { type: 'NODE_CREATED'; nodeId: NodeId; revisionId: RevisionId; timestamp: string }
  | { type: 'NODE_UPDATED'; nodeId: NodeId; revisionId: RevisionId; timestamp: string }
  | { type: 'NODE_PUBLISHED'; nodeId: NodeId; revisionId: RevisionId; timestamp: string }
  | { type: 'EDGE_CREATED'; edgeId: EdgeId; timestamp: string }
  | { type: 'EDGE_DELETED'; edgeId: EdgeId; timestamp: string };
