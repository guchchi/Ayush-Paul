import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { getKnowledgeGraph } from '../lib/knowledge-graph/instance';
import { BlueprintsHero } from '../components/sections/BlueprintsHero';
import { BlueprintsFeatured } from '../components/sections/BlueprintsFeatured';
import { BlueprintsGrid } from '../components/sections/BlueprintsGrid';
import { BlueprintsWhy } from '../components/sections/BlueprintsWhy';
import { BlueprintsFAQ } from '../components/sections/BlueprintsFAQ';
import { BlueprintsFinalCTA } from '../components/sections/BlueprintsFinalCTA';

export const BlueprintsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const kg = getKnowledgeGraph();
      
      // SEO Injection via Graph Service
      const seoData = await kg.seoService.generateSeoMetadata('eco_blueprints', 'en');
      if (seoData) {
        document.title = seoData.title;
      }

      const allNodes = await kg.repository.getAllNodes();
      const productNodes = allNodes.filter(n => n.nodeType === 'PRODUCT');

      const mappedProducts: Product[] = productNodes.map(node => ({
        id: node.nodeId,
        title: node.title.en,
        slug: node.slug.en,
        description: node.description?.en || '',
        thumbnail: node.properties.thumbnailUrl || '/images/blueprint-placeholder.jpg',
        category: 'Blueprint',
        type: 'free' as const,
        basePrice: node.properties.priceInCents || 0,
        salePrice: 0,
        discountPercentage: 0,
        inventoryCount: null,
        downloadFileURL: null,
        previewImages: [],
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
      }));

      setProducts(mappedProducts);
    } catch (err: any) {
      console.error("Failed to load blueprints from Knowledge Graph:", err);
      setProducts([]);
      setError(err?.message || "Failed to load blueprints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full min-h-screen bg-bg-primary text-[#0b1c30]">
      <BlueprintsHero onExploreClick={() => {}} onBrowseClick={() => {}} />
      <BlueprintsFeatured />
      <BlueprintsGrid
        products={products}
        loading={loading}
        error={!!error}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        onRetry={fetchProducts}
        trackEvent={() => {}}
      />
      <BlueprintsWhy />
      <BlueprintsFAQ />
      <BlueprintsFinalCTA />
    </motion.div>
  );
};

export default BlueprintsPage;
