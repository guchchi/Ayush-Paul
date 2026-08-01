import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import type { Product } from '../types';
import { getProductBySlug } from '../lib/product-utils';
import { generateInitialGraph } from '../lib/knowledge-graph/seed/initial-seed';
import { BlueprintProjection } from '../lib/knowledge-graph/projections/projections';
import { auth, onAuthStateChanged, db, doc, setDoc, getDoc, serverTimestamp } from '../firebase';
import { AuthModal } from '../components/ui/AuthModal';
import { useAnalytics } from '../hooks/useAnalytics';
import { BackButton } from '../components/ui/back-button';
import { secureDownload } from '../lib/download';
import type { CouponResult } from '../components/ui/CouponInput';

import { BlueprintHeroSection } from '../components/sections/BlueprintHeroSection';
import { BlueprintVideoSection } from '../components/sections/BlueprintVideoSection';
import { BlueprintQuickFacts } from '../components/sections/BlueprintQuickFacts';
import { BlueprintWhatYouAchieve } from '../components/sections/BlueprintWhatYouAchieve';
import { BlueprintWhoShouldUse } from '../components/sections/BlueprintWhoShouldUse';
import { BlueprintModulesSection } from '../components/sections/BlueprintModulesSection';
import { BlueprintWhyICreated } from '../components/sections/BlueprintWhyICreated';
import { BlueprintRoadmap } from '../components/sections/BlueprintRoadmap';
import { BlueprintResults } from '../components/sections/BlueprintResults';
import { BlueprintFreeVsPro } from '../components/sections/BlueprintFreeVsPro';
import { BlueprintPurchaseSidebar } from '../components/sections/BlueprintPurchaseSidebar';
import { BlueprintSidebarFAQ } from '../components/sections/BlueprintSidebarFAQ';
import { BlueprintRelatedContent } from '../components/sections/BlueprintRelatedContent';
import { BlueprintStickyMobileBar } from '../components/sections/BlueprintStickyMobileBar';
import { BlueprintGetClientsPage } from './BlueprintGetClientsPage';

import { getKnowledgeGraph } from '../lib/knowledge-graph/instance';
import type { BlueprintPageViewModel } from '../lib/knowledge-graph/projections/projections';

export const BlueprintDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [viewModel, setViewModel] = useState<BlueprintPageViewModel | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [appliedCoupon] = useState<CouponResult | null>(() => {
    const stored = sessionStorage.getItem('pending_coupon');
    return stored ? JSON.parse(stored) : null;
  });

  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) setProfile(snap.data());
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const kg = getKnowledgeGraph();
        const node = await kg.repository.getNodeBySlug(slug, 'en');
        if (node && node.nodeType === 'PRODUCT') {
          const vm = await kg.blueprintProjection.project(node.nodeId, kg.repository, kg.contentRepository);
          setViewModel(vm);
          
          // Generate graph SEO
          const seoData = await kg.seoService.generateSeoMetadata(node.nodeId, 'en');
          if (seoData) {
            document.title = seoData.title;
          }

          const mappedProduct: Product = {
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
            rating: 5,
            author: {
              name: 'Ayush Paul',
              role: 'Founder',
              avatar: '/images/author-avatar.jpg'
            }
          };
          setProduct(mappedProduct);
          trackEvent('Blueprint Viewed', { slug: node.slug.en, id: node.nodeId, title: node.title.en });
        } else {
          const data = await getProductBySlug(slug);
          if (data) setProduct(data);
        }
      } catch (err) {
        console.error("Failed to load blueprint from Knowledge Graph:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const canonical = getCanonicalUrl(`/blueprints/${slug}`);
  const basePrice = product?.basePrice || 0;
  const salePrice = product?.salePrice || 0;
  const currentPrice = salePrice > 0 ? salePrice : basePrice;

  useSEO({
    title: product ? `${product.title} | Implementation Blueprint by Ayush Paul` : "Loading Blueprint...",
    description: product?.description || "Browse implementation blueprints, AI prompt packs, and automation workflows.",
    keywords: product?.tags?.join(", ") || "implementation blueprint, Ayush Paul, automation workflow, AI prompt template",
    url: canonical,
    image: product?.thumbnail || "/og-image.png",
    schema: product ? [
      {
        "@type": "Product",
        "@id": `${canonical}#product`,
        "name": product.title,
        "description": product.description,
        "image": {
          "@type": "ImageObject",
          "url": getCanonicalUrl(product.thumbnail || "/og-image.png")
        },
        "sku": product.slug,
        "category": "Digital Blueprint",
        "url": canonical,
        "brand": {
          "@id": `${getCanonicalUrl()}/#organization`
        },
        "manufacturer": {
          "@id": `${getCanonicalUrl()}/#organization`
        },
        "offers": {
          "@type": "Offer",
          "url": canonical,
          "priceCurrency": "INR",
          "price": currentPrice,
          "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          "availability": "https://schema.org/InStock",
          "seller": {
            "@id": `${getCanonicalUrl()}/#organization`
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": getCanonicalUrl()
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blueprints",
            "item": getCanonicalUrl("/blueprints")
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.title,
            "item": canonical
          }
        ]
      },
      ...(product.faq && product.faq.length > 0 ? [{
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        "mainEntity": product.faq.map((f: any) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }] : [])
    ] : null
  });

  const handleFreeDownload = async () => {
    if (!product) return;

    // Target blueprint: route directly to Module 1 workspace
    if (slug === TARGET_ENGINE_SLUG) {
      navigate('/workspace/client-acquisition');
      return;
    }

    setIsDownloading(true);
    try {
      trackEvent('free_download', { product_id: product.id, product_name: product.title });
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const currentOwned = snap.exists() ? (snap.data()?.ownedProducts || {}) : {};
        currentOwned[product.id] = "free";
        await setDoc(userRef, { ownedProducts: currentOwned, updatedAt: serverTimestamp() }, { merge: true });
      }
      const filename = product.title.replace(/\s+/g, '-').toLowerCase() + '.zip';
      await secureDownload(product.id, filename);
      setTimeout(() => navigate('/thank-you'), 1000);
    } catch (error: any) {
      alert(error.message || "Failed to process free download.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePremiumUpgrade = async () => {
    if (!product) return;

    // Target blueprint: route directly to Module 1 workspace
    if (slug === TARGET_ENGINE_SLUG) {
      navigate('/workspace/client-acquisition');
      return;
    }

    trackEvent('premium_intent', { product_id: product.id, product_name: product.title });
    if (!user) { setIsAuthModalOpen(true); return; }
    setIsCheckingOut(true);
    trackEvent('checkout_start', { product_id: product.id, product_name: product.title });
    try {
      const token = await user.getIdToken();
      const body: Record<string, any> = { productId: product.id, userId: user.uid, email: user.email };
      if (appliedCoupon?.code) body.couponCode = appliedCoupon.code;
      if (appliedCoupon?.assignedToCreator) body.creatorCode = appliedCoupon.assignedToCreator;
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.url) { window.location.href = data.url; }
      else { alert(`Checkout Error: ${data.error || "Failed to initialize checkout."}`); throw new Error(data.error); }
    } catch (_error: any) {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0058be]/25 border-t-[#0058be] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center text-center px-6 text-[#0b1c30]">
        <h2 className="text-2xl font-bold mb-3">Blueprint Not Found</h2>
        <p className="text-[#424754] text-sm mb-6">The requested blueprint does not exist.</p>
        <button onClick={() => navigate('/blueprints')} className="px-4 py-2 rounded-lg bg-[#0b1c30] text-white text-sm font-medium hover:bg-[#0058be] transition-colors cursor-pointer">
          Return to Blueprints
        </button>
      </div>
    );
  }

  const isFree = product.type === 'free';
  const hasDiscount = product.salePrice > 0 && product.salePrice < product.basePrice;
  const isOwned = profile?.ownedProducts?.[product.id] === 'premium' || (isFree && profile?.ownedProducts?.[product.id] === 'free');
  const isComingSoon = product.status === 'COMING_SOON';

  if (isComingSoon) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full min-h-screen bg-bg-primary text-[#0b1c30] pt-20 pb-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8"><BackButton to="/blueprints" label="Back to Blueprints" /></div>
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#fff8e1] border border-[#ffe082] flex items-center justify-center mx-auto mb-6">
              <Lock size={20} className="text-[#f57f17]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">{product.title}</h1>
            <p className="text-[#424754] text-sm mb-6 max-w-md mx-auto">{product.description}</p>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fff8e1] border border-[#ffe082] text-[#f57f17] text-xs font-medium">
              <Lock size={12} /> Coming Soon
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (slug === TARGET_ENGINE_SLUG) {
    return (
      <BlueprintGetClientsPage 
        product={product}
        isOwned={isOwned}
        hasDiscount={hasDiscount}
        isDownloading={isDownloading}
        isCheckingOut={isCheckingOut}
        onFreeDownload={handleFreeDownload}
        onPremiumUpgrade={handlePremiumUpgrade}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary text-[#0b1c30] pt-20 pb-24 lg:pb-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Back */}
        <div className="mb-10">
          <BackButton to="/blueprints" label="Back to Blueprints" />
        </div>

        {/* Hero — Full Width */}
        <div className="mb-20">
          <BlueprintHeroSection product={product} />
        </div>

        {/* Free vs Pro — Full Width */}
        <div className="mb-20">
          <BlueprintFreeVsPro
            product={product}
            isOwned={isOwned}
            isCheckingOut={isCheckingOut}
            isDownloading={isDownloading}
            onFreeDownload={handleFreeDownload}
            onPremiumUpgrade={handlePremiumUpgrade}
          />
        </div>

        {/* Video — Full Width (if no video in hero) */}
        {product.youtubeVideoId && (
          <div className="mb-20">
            <BlueprintVideoSection product={product} />
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left — Main Content (70%) */}
          <div className="flex-1 min-w-0">
            <div className="space-y-24">
              {/* Quick Facts */}
              <BlueprintQuickFacts product={product} />

              {/* Achievements */}
              <BlueprintWhatYouAchieve product={product} />

              {/* Who It's For */}
              <BlueprintWhoShouldUse product={product} />

              {/* What's Inside */}
              <BlueprintModulesSection product={product} />

              {/* Why I Created This */}
              <BlueprintWhyICreated product={product} />

              {/* Implementation Roadmap */}
              <BlueprintRoadmap product={product} />

              {/* Results / Benefits */}
              <BlueprintResults product={product} />
            </div>
          </div>

          {/* Right — Sticky Sidebar (30%) */}
          <div className="lg:w-[320px] shrink-0">
            <div className="sticky top-24 space-y-5">
              {/* Purchase Card */}
              <BlueprintPurchaseSidebar
                product={product}
                isOwned={isOwned}
                isCheckingOut={isCheckingOut}
                isDownloading={isDownloading}
                hasDiscount={hasDiscount}
                onPremiumUpgrade={handlePremiumUpgrade}
                onFreeDownload={handleFreeDownload}
              />

              {/* FAQ */}
              <BlueprintSidebarFAQ product={product} />

              {/* Related Content */}
              <BlueprintRelatedContent currentProduct={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Mobile Sticky Bar */}
      <BlueprintStickyMobileBar
        product={product}
        isOwned={isOwned}
        isCheckingOut={isCheckingOut}
        isDownloading={isDownloading}
        onPremiumUpgrade={handlePremiumUpgrade}
        onFreeDownload={handleFreeDownload}
      />
    </motion.div>
  );
};

export default BlueprintDetailPage;
