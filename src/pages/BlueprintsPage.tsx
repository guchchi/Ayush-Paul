import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { getPublishedProducts } from '../lib/product-utils';
import { Product } from '../types';
import { generateInitialGraph } from '../lib/knowledge-graph/seed/initial-seed';
import { BlueprintsHero } from '../components/sections/BlueprintsHero';
import { BlueprintsFeatured } from '../components/sections/BlueprintsFeatured';
import { BlueprintsGrid } from '../components/sections/BlueprintsGrid';
import { BlueprintsWhy } from '../components/sections/BlueprintsWhy';
import { BlueprintsFAQ } from '../components/sections/BlueprintsFAQ';
import { BlueprintsFinalCTA } from '../components/sections/BlueprintsFinalCTA';

const trackEvent = (eventName: string, payload?: Record<string, any>) => {
  console.log(`[Analytics Event] ${eventName}`, payload);
};

export const BlueprintsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(false);
      const { repository } = generateInitialGraph();
      const allNodes = await repository.getAllNodes();
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
        tier: 'free',
        features: [],
        published: true,
        featured: true,
        rating: 5,
        reviewCount: 1,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt
      }));

      setProducts(mappedProducts);
    } catch (err) {
      console.error("Failed to load blueprints from Knowledge Graph:", err);
      setProducts([]);
      setError(true);
      trackEvent('Connection Failed', { error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Inject FAQPage schema separately (alongside CollectionPage schema in useSEO)
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a Blueprint?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Blueprint is a pre-built implementation resource — such as an AI prompt pack, code starter template, automation workflow, or operational checklist — that developers and builders can use immediately without setup or configuration."
          }
        },
        {
          "@type": "Question",
          "name": "Who are Blueprints designed for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Blueprints are designed for developers, solo founders, and technical creators who want to skip the research phase and begin building immediately using validated configurations."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need coding experience to use a Blueprint?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No coding experience is required for AI prompt packs and operational checklists. Code templates and automation workflows are designed for developers with basic programming knowledge. Each Blueprint clearly states the required technical level."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between a Blueprint and a course?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Blueprint is a ready-to-use file you deploy immediately — a prompt pack, template, or workflow. A course teaches the reasoning and architecture behind how those blueprints were built. Blueprints are for doing; courses are for learning."
          }
        },
        {
          "@type": "Question",
          "name": "Can I get help implementing a Blueprint?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. For custom modifications, API integrations, or full system deployment, you can work directly with Ayush Paul through Studio at thepaulx.in/collaborate."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get started with Blueprints?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Browse by format — Prompts, Templates, Workflows, Automations, or Checklists — or search by keyword in the Blueprints Library. If you're unsure where to begin, the Featured Blueprints section highlights the most commonly used starting points."
          }
        }
      ]
    };

    let faqScript = document.getElementById('blueprints-faq-json-ld');
    if (!faqScript) {
      faqScript = document.createElement('script');
      faqScript.id = 'blueprints-faq-json-ld';
      faqScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(faqScript);
    }
    faqScript.textContent = JSON.stringify(faqSchema);

    return () => {
      const el = document.getElementById('blueprints-faq-json-ld');
      if (el) el.remove();
    };
  }, []);

  useSEO({
    title: "Ready-To-Use Blueprints — AI Prompts, Templates & Automation Workflows | Ayush Paul",
    description: "A library of ready-to-use AI prompt packs, code starter templates, automation workflows, and operational checklists for developers and founders. Skip the setup. Start building.",
    keywords: "AI prompt templates, implementation blueprints, automation workflows, Cursor AI rules, Next.js boilerplate, SEO checklists, Make.com automation, developer templates, SaaS starter kit, technical checklists for developers",
    url: getCanonicalUrl("/blueprints"),
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Implementation Blueprints Library — Prompts, Templates & Workflows",
      "description": "A curated library of AI prompt packs, code starter templates, automation workflows, SEO checklists, and implementation blueprints for developers and founders. Created by Ayush Paul.",
      "url": getCanonicalUrl("/blueprints"),
      "author": {
        "@type": "Person",
        "name": "Ayush Paul",
        "url": getCanonicalUrl()
      },
      "about": [
        { "@type": "Thing", "name": "AI Prompt Templates" },
        { "@type": "Thing", "name": "Code Boilerplate Templates" },
        { "@type": "Thing", "name": "Automation Workflows" },
        { "@type": "Thing", "name": "SEO Checklists" },
        { "@type": "Thing", "name": "Implementation Frameworks" }
      ],
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": getCanonicalUrl("/")
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blueprints",
            "item": getCanonicalUrl("/blueprints")
          }
        ]
      }
    }
  });

  const scrollToExplore = () => {
    const el = document.getElementById('blueprints-grid-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      trackEvent('CTA Clicked', { location: 'Hero', label: 'Explore Library', targetUrl: '#blueprints-grid-anchor' });
    }
  };

  const scrollToWhy = () => {
    const el = document.getElementById('blueprints-why-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      trackEvent('CTA Clicked', { location: 'Hero', label: 'How It Works', targetUrl: '#blueprints-why-anchor' });
    }
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    trackEvent('Category Selected', { category });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary pt-32 relative overflow-hidden text-text-primary"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-100 -z-10" />

      {/* 1. HERO SECTION */}
      <BlueprintsHero 
        onExploreClick={scrollToExplore} 
        onBrowseClick={scrollToWhy} 
        loading={loading}
      />

      {/* 2. FEATURED BLUEPRINTS */}
      <BlueprintsFeatured />

      {/* 3. ALL BLUEPRINTS LIBRARY */}
      <BlueprintsGrid 
        products={products} 
        loading={loading} 
        error={error} 
        activeCategory={activeCategory} 
        onCategorySelect={handleCategorySelect}
        onRetry={fetchProducts} 
        trackEvent={trackEvent} 
      />

      {/* 4. WHY BLUEPRINTS EXIST */}
      <BlueprintsWhy />

      {/* 5. FAQ SECTION */}
      <BlueprintsFAQ />

      {/* 6. FINAL CTA */}
      <BlueprintsFinalCTA trackEvent={trackEvent} />
    </motion.div>
  );
};

export default BlueprintsPage;
