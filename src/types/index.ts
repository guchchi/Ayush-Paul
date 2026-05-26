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
    fullPath?: string; // Stored path for cleanup
  };
  localFile?: File; // For UI state
  localPreview?: string; // For UI state
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

// --- Digital Ecosystem Types ---

export type ProductType = 'free' | 'paid' | 'donation';

export interface ProductFeature {
  name: string;
  isPremiumOnly: boolean;
}

export enum AssetCategory {
  PDF = 'pdf',
  PROMPT = 'prompt',
  TEMPLATE = 'template',
  WORKFLOW = 'workflow',
  DIAGRAM = 'diagram',
  BUNDLE = 'bundle',
  CODE = 'code_snippet',
  MODULAR = 'modular_asset',
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: AssetCategory;
  isPremium: boolean;
  fileSize?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description?: string;
  changes: {
    added?: string[];
    improved?: string[];
    fixed?: string[];
  };
}

export interface DigitalSystem {
  id: string;
  title: string;
  slug: string;
  currency?: string;
  description: string;
  thumbnail: string;
  category: string;
  type: ProductType;
  basePrice: number;
  salePrice: number;
  discountPercentage: number;
  inventoryCount: number | null; // null means unlimited
  downloadFileURL: string | null; // For free products (direct access)
  previewImages: string[];
  features: ProductFeature[];
  comparisonFree: string[];
  comparisonPremium: string[];
  tags: string[];
  createdAt: any;
  updatedAt: any;
  isFeatured: boolean;
  isPublished: boolean;
  purchaseCount: number;
  downloadCount: number;
  viewCount: number;
  rating: number;
  stripePriceId?: string; // For Phase 3
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  
  // New Digital System Architecture fields
  resources?: ResourceItem[];
  changelog?: ChangelogEntry[];
  architectureDiagramURL?: string;
}

export type Product = DigitalSystem;

export interface DownloadAnalytics {
  id: string;
  productId: string;
  productSlug: string;
  timestamp: any;
  isAnonymous: boolean;
  userId?: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  amount: number;
  productSupported: string | null;
  message: string;
  timestamp: any;
}

