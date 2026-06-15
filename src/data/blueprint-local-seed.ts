import type { Product } from '../types';

export const LOCAL_SEED_PRODUCTS: Product[] = [
  {
    id: 'get-your-first-3-clients',
    title: 'Get Your First 3 Clients',
    slug: 'get-your-first-3-clients',
    description:
      'Choose your service direction, define your market, create your first positioning statement, and prepare the foundation for getting your first clients.',
    thumbnail:
      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23eff4ff%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23d1f34d%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22800%22 height=%22400%22 fill=%22url(%23g)%22/%3E%3Ctext x=%22400%22 y=%22200%22 text-anchor=%22middle%22 font-family=%22system-ui%22 font-size=%2232%22 font-weight=%22800%22 fill=%22%230b1c30%22%3EGet Your First 3 Clients%3C/text%3E%3C/svg%3E',
    category: 'Client Acquisition',
    type: 'free',
    basePrice: 0,
    salePrice: 0,
    discountPercentage: 0,
    inventoryCount: null,
    downloadFileURL: null,
    freeFileUrl: null,
    paidFileUrl: null,
    previewImages: [],
    features: [],
    comparisonFree: [],
    comparisonPremium: [],
    tags: [
      'Client Acquisition',
      'Freelancing',
      'Offer Building',
      'Beginner Friendly',
    ],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    isFeatured: false,
    isPublished: true,
    purchaseCount: 0,
    downloadCount: 0,
    viewCount: 0,
    rating: 0,
    stripePriceId: '',
    productTier: 'free',
    status: 'PUBLISHED',
    currency: 'usd',
    author: {
      name: 'Ayush Paul',
      role: 'Systems Builder',
      avatar: '/founder.png',
    },
  },
];
