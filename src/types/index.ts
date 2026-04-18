export type BlockType = 'text' | 'heading' | 'image' | 'code' | 'quote' | 'video' | 'callout' | 'divider' | 'list';

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  metadata?: {
    level?: 1 | 2 | 3 | 4;
    listType?: 'ordered' | 'unordered';
    alignment?: 'left' | 'center' | 'full';
    caption?: string;
    alt?: string;
    language?: string;
    variant?: 'info' | 'warning' | 'success' | 'danger';
    title?: string;
  };
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
