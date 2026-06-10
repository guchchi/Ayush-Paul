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

export type ProductTier = 'free' | 'starter' | 'pro' | 'premium';

export type ContentStatus = 'DRAFT_SEED' | 'PUBLISHED' | 'COMING_SOON';

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
  freeFileUrl?: string | null;    // Free resource file (public, no purchase required)
  paidFileUrl?: string | null;    // Paid resource file (only after purchase, in Vault)
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
  productTier?: ProductTier;
  status?: string; // DRAFT_SEED, PUBLISHED, etc.
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

// --- Email Scheduling System ---

export type ScheduledEmailType = 'abandoned' | 'streak' | 'upsell' | 'streak_broken' | 'purchase_followup' | 'creator_promo';
export type ScheduledEmailStatus = 'pending' | 'sent' | 'failed' | 'cancelled';

export interface ScheduledEmail {
  id?: string;
  type: ScheduledEmailType;
  userId: string;
  userEmail?: string;
  userName?: string;
  sendAt: any;
  sentAt?: any;
  status: ScheduledEmailStatus;
  metadata?: Record<string, any>;
  error?: string;
  createdAt: any;
}

// --- Share-to-Unlock System ---

export interface ShareEvent {
  id?: string;
  userId: string;
  shareTarget: 'whatsapp' | 'twitter' | 'linkedin' | 'copy_link' | 'other';
  shareCount: number;
  milestoneUnlocked?: string;
  createdAt: any;
}

// --- Streak Milestones ---

export interface StreakMilestone {
  id?: string;
  userId: string;
  streakDays: number;
  milestoneTier: 3 | 7 | 14;
  rewardType: 'badge' | 'coupon' | 'content_unlock';
  rewardValue: string;
  claimed: boolean;
  claimedAt?: any;
  createdAt: any;
}

// --- Creator Affiliate System ---

export interface CreatorCode {
  id?: string;
  code: string;
  creatorName: string;
  userId?: string;
  commissionRate: number;
  totalSales: number;
  totalEarnings?: number;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

// --- Workshop System ---

export type WorkshopStatus = 'DRAFT' | 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface Workshop {
  id: string;
  title: string;
  slug?: string;
  description: string;
  topic?: string;
  date: string;
  time?: string;
  duration?: string;
  instructor?: string;
  meetingLink?: string;
  zoomLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  meetingPlatform?: string;
  workshopStartTime?: string;
  workshopStatus: WorkshopStatus;
  isPublished: boolean;
  isFree: boolean;
  price?: number;
  totalSeats?: number;
  seatsLeft?: number;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  recordingUrl?: string;
  reminderSchedule?: string;
  lastNotifiedAt?: any;
  createdAt: any;
  updatedAt: any;
}

export interface WorkshopRegistration {
  id?: string;
  userId?: string;
  email: string;
  name?: string;
  workshopId: string;
  workshopName: string;
  registrationType: 'waitlist' | 'registered';
  source: string;
  status: string;
  registeredAt: any;
  notifiedAt?: any;
  confirmationSentAt?: any;
}

export interface WorkshopRegistration {
  id?: string;
  userId?: string;
  email: string;
  name?: string;
  workshopId: string;
  workshopName: string;
  registrationType: 'waitlist' | 'registered';
  source: string;
  status: string;
  registeredAt: any;
  notifiedAt?: any;
}

export interface CreatorSaleLog {
  id?: string;
  creatorCode: string;
  creatorName: string;
  orderId: string;
  productId: string;
  productTitle?: string;
  userId: string;
  productPrice: number;
  discountApplied: number;
  commission: number;
  commissionRate: number;
  currency: string;
  timestamp: any;
}

