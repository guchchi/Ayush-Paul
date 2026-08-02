import { Product } from "../types";
import { getKnowledgeGraph } from "./knowledge-graph/instance";
import { BlueprintProjection } from "./knowledge-graph/projections/projections";

let graphCache: Product[] | null = null;

export const getPublishedProducts = async (): Promise<Product[]> => {
  if (graphCache) return graphCache;

  const kg = getKnowledgeGraph();
  const allNodes = await kg.repository.getAllNodes();
  const productNodes = allNodes.filter(n => n.nodeType === 'PRODUCT');

  graphCache = productNodes.map(node => {
    const slug = node.slug.en;
    const thumbnail = node.properties.thumbnailUrl || '/og-image.png';
    return {
      id: node.nodeId,
      title: node.title.en,
      slug: slug,
      description: node.description?.en || '',
      thumbnail: thumbnail,
      image: thumbnail,
      ctaLink: `/blueprints/${slug}`,
      category: 'Blueprint',
      categoryLabel: 'Blueprint System',
      tier: 'FREE SYSTEM',
      type: 'free' as const,
      basePrice: node.properties.priceInCents || 0,
      salePrice: 0,
      discountPercentage: 0,
      inventoryCount: null,
      downloadFileURL: null,
      previewImages: [thumbnail],
      features: [],
      comparisonFree: [],
      comparisonPremium: [],
      tags: ['blueprint'],
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      isFeatured: true,
      isPublished: true,
      purchaseCount: 0,
      downloadCount: 0,
      viewCount: 0,
      rating: 5,
      author: {
        name: 'Ayush Paul',
        role: 'Founder',
        avatar: '/images/author-avatar.jpg'
      }
    };
  });

  return graphCache;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const products = await getPublishedProducts();
  return products.find(p => p.slug === slug) || null;
};
