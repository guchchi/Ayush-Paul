import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { getPublishedProducts } from '../lib/product-utils';
import { Product } from '../types';
import { BlueprintsHero } from '../components/sections/BlueprintsHero';
import { BlueprintsCategories } from '../components/sections/BlueprintsCategories';
import { BlueprintsFeatured } from '../components/sections/BlueprintsFeatured';
import { BlueprintsGrid } from '../components/sections/BlueprintsGrid';
import { BlueprintsWhy } from '../components/sections/BlueprintsWhy';
import { BlueprintsFAQ } from '../components/sections/BlueprintsFAQ';
import { BlueprintsFinalCTA } from '../components/sections/BlueprintsFinalCTA';

const trackEvent = (eventName: string, payload?: Record<string, any>) => {
  console.log(`[Analytics Event] ${eventName}`, payload);
};

const DEFAULT_SYSTEM_PROPS = {
  thumbnail: '',
  basePrice: 0,
  salePrice: 0,
  discountPercentage: 0,
  inventoryCount: null,
  downloadFileURL: null,
  previewImages: [],
  features: [],
  comparisonFree: [],
  comparisonPremium: [],
  updatedAt: new Date().toISOString(),
  isFeatured: false,
  purchaseCount: 0,
  downloadCount: 0,
  viewCount: 0,
  rating: 5,
  author: {
    name: 'Ayush Paul',
    role: 'Creator',
    avatar: ''
  }
};

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-cursor-ai',
    title: 'Cursor AI Execution Pack',
    slug: 'cursor-ai-execution-pack',
    description: 'A pre-configured package of custom system rules, .cursorrules prompts, and configurations designed to speed up product design and TypeScript builds.',
    category: 'Prompts',
    tags: ['Prompts', 'Config', 'Rules', 'Advanced'],
    type: 'free',
    isPublished: true,
    createdAt: new Date().toISOString(),
    ...DEFAULT_SYSTEM_PROPS,
  },
  {
    id: 'demo-saas-blueprint',
    title: 'Next.js SaaS Launch Blueprint',
    slug: 'nextjs-saas-launch-blueprint',
    description: 'A premium boilerplate for building personal websites and web applications. Includes authentication, dynamic database sync, Stripe payments, and a dynamic tailwind grid.',
    category: 'Templates',
    tags: ['Components', 'Auth', 'Stripe', 'Intermediate'],
    type: 'paid',
    isPublished: true,
    createdAt: new Date().toISOString(),
    ...DEFAULT_SYSTEM_PROPS,
  },
  {
    id: 'demo-authority-seo',
    title: 'Technical Authority SEO Engine',
    slug: 'technical-authority-seo-engine',
    description: 'A structured workflow and checklist designed to audit architecture, optimize crawls, build high-converting schemas, and establish sustainable organic growth.',
    category: 'Workflows',
    tags: ['Audit', 'Schema', 'Core Web', 'Intermediate'],
    type: 'free',
    isPublished: true,
    createdAt: new Date().toISOString(),
    ...DEFAULT_SYSTEM_PROPS,
  },
  {
    id: 'demo-workflow-automation',
    title: 'Make.com Automation Playbook',
    slug: 'make-automation-playbook',
    description: 'Connect databases, waitlists, notifications, and analytics into zero-maintenance execution workflows using pre-built Make scenarios.',
    category: 'Automations',
    tags: ['Scenarios', 'Triggers', 'Modules', 'Beginner'],
    type: 'paid',
    isPublished: true,
    createdAt: new Date().toISOString(),
    ...DEFAULT_SYSTEM_PROPS,
  },
  {
    id: 'demo-brand-site',
    title: 'Personal Brand Website System',
    slug: 'personal-brand-website-system',
    description: 'A clean, high-performance website blueprint for creators and developers looking to publish their portfolio, case studies, and services.',
    category: 'Templates',
    tags: ['Templates', 'Tailwind', 'Portfolio', 'Beginner'],
    type: 'free',
    isPublished: true,
    createdAt: new Date().toISOString(),
    ...DEFAULT_SYSTEM_PROPS,
  },
  {
    id: 'demo-ai-researcher',
    title: 'AI Research & Content Process',
    slug: 'ai-research-content-process',
    description: 'Automate content research, academic summaries, case studies, and outlining using fine-tuned prompt structures and LLM pipelines.',
    category: 'Workflows',
    tags: ['Research', 'Academic', 'Content', 'Intermediate'],
    type: 'free',
    isPublished: true,
    createdAt: new Date().toISOString(),
    ...DEFAULT_SYSTEM_PROPS,
  }
];

export const BlueprintsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getPublishedProducts();
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(DEMO_PRODUCTS);
      }
    } catch (err) {
      console.error("Failed to load blueprints:", err);
      setProducts(DEMO_PRODUCTS);
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
            "text": "Yes. For custom modifications, API integrations, or full system deployment, you can collaborate directly with Ayush Paul through the Work Together page at ayushpaul.in/collaborate."
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

  const scrollToBrowse = () => {
    const el = document.getElementById('categories-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      trackEvent('CTA Clicked', { location: 'Hero', label: 'Browse Categories', targetUrl: '#categories-section' });
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
        onBrowseClick={scrollToBrowse} 
        loading={loading}
      />

      {/* 2. CATEGORIES SECTION */}
      <BlueprintsCategories 
        activeCategory={activeCategory} 
        onSelectCategory={handleCategorySelect} 
      />

      {/* 3. FEATURED BLUEPRINTS */}
      <BlueprintsFeatured />

      {/* 4. ALL BLUEPRINTS LIBRARY */}
      <BlueprintsGrid 
        products={products} 
        loading={loading} 
        error={error} 
        activeCategory={activeCategory} 
        onRetry={fetchProducts} 
        trackEvent={trackEvent} 
      />

      {/* 5. WHY BLUEPRINTS EXIST */}
      <BlueprintsWhy />

      {/* 6. FAQ SECTION */}
      <BlueprintsFAQ />

      {/* 7. FINAL CTA */}
      <BlueprintsFinalCTA trackEvent={trackEvent} />
    </motion.div>
  );
};

export default BlueprintsPage;
