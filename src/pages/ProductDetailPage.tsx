import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, X, ShieldCheck, Download, Clock, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useAnalytics } from '../hooks/useAnalytics';
import { getCanonicalUrl } from '../lib/domain';
import { getProductBySlug } from '../lib/product-utils';
import { auth, onAuthStateChanged } from '../firebase';
import { AuthModal } from '../components/ui/AuthModal';
import { ProductBadge } from '../components/ui/ProductBadge';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  useSEO({
    title: product ? `${product.title} | Ayush Paul Lab` : "Loading Innovation...",
    description: product?.description || "",
    keywords: product?.tags.join(", ") || "",
    canonicalUrl: getCanonicalUrl(`/products/${slug}`),
    ogImage: product?.thumbnail
  });

  // SEO: Inject JSON-LD Product Schema
  useEffect(() => {
    if (!product) return;

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "image": [product.thumbnail],
      "description": product.description,
      "sku": product.id,
      "brand": {
        "@type": "Brand",
        "name": "Ayush Paul Lab"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": product.currency || "INR",
        "price": product.salePrice || product.basePrice,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Person",
          "name": "Ayush Paul"
        }
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [product]);

  // Track time on page and view event
  useEffect(() => {
    if (!product) return;
    
    // Track product view on load
    trackEvent('product_view', {
      product_id: product.id,
      product_name: product.title,
      product_type: product.type
    });

    const timer = setTimeout(() => {
      // Time on page
      console.log(`[Analytics] User spent > 10s on ${product.title}`);
    }, 10000);
    return () => clearTimeout(timer);
  }, [product]);

  const handleFreeDownload = async () => {
    if (!product || !product.downloadFileURL) return;
    setIsDownloading(true);
    
    // 1. Track the download analytics via PostHog (Batched)
    trackEvent('free_download', {
      product_id: product.id,
      product_name: product.title
    });
    
    // 2. Trigger the actual file download in a hidden iframe or blank target
    const link = document.createElement('a');
    link.href = product.downloadFileURL;
    link.target = '_blank';
    link.download = product.title.replace(/\s+/g, '-').toLowerCase() + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 3. Redirect to Thank You page
    setTimeout(() => {
      navigate('/thank-you');
    }, 1000);
  };

  const handlePremiumUpgrade = async () => {
    if (!product) return;
    
    trackEvent('premium_intent', {
      product_id: product.id,
      product_name: product.title
    });
    
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckingOut(true);
    trackEvent('checkout_start', {
      product_id: product.id,
      product_name: product.title
    });

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id, 
          userId: user.uid,
          email: user.email
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initialize checkout.");
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      alert(error.message);
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Loading Blueprint</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Innovation Not Found</h2>
        <p className="text-white/40 mb-8">This blueprint might have been removed or the link is invalid.</p>
        <button onClick={() => navigate('/products')} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold">
          Return to Lab
        </button>
      </div>
    );
  }

  const isFree = product.type === 'free';
  const hasDiscount = product.salePrice > 0 && product.salePrice < product.basePrice;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-32"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Lab
        </button>

        {/* Hero Conversion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          
          {/* Left: Product Info & Triggers */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20">
                {product.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1">
                <ShieldCheck size={12} className="text-green-500" /> Secure System
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
              {product.title}
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl">
              {product.description}
            </p>

            {/* Psychological Triggers */}
            <div className="flex flex-col gap-4 mb-10">
              {(product.inventoryCount ?? 0) < 10 && product.type !== 'free' && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                >
                  <Clock size={18} className="animate-pulse" /> 
                  High Demand: Only {product.inventoryCount} copies left at current tier.
                </motion.div>
              )}
              
              {isFree && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-bold">
                  <Zap size={18} /> 
                  Starter Blueprint: Upgrade anytime to unlock full CAD + Source.
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-white/60 font-medium">
                  <Zap size={16} className="text-brand-primary" />
                  <span className="text-white font-bold">{product.downloadCount + 120}</span> innovators using this
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-2 text-white/60 font-medium">
                  <span className="text-white font-bold">4.9/5</span> Rating
                </div>
              </div>
            </div>

            {/* Creator Credibility - Founder Profile Block */}
            <div className="mt-4 p-6 rounded-[2rem] bg-white/5 border border-brand-primary/20 backdrop-blur-md flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:bg-brand-primary/5 transition-all">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-brand-primary rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={product.author.avatar} 
                  alt={product.author.name} 
                  className="w-16 h-16 rounded-full border-2 border-brand-primary/30 relative z-10" 
                />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Built By</span>
                  <ShieldCheck size={14} className="text-brand-primary" />
                </div>
                <span className="text-xl font-bold mb-2">{product.author.name}</span>
                <p className="text-sm text-white/60 leading-relaxed">
                  Creator of the {product.title}. My mission is to open-source cutting edge robotics and software engineering systems to empower the next generation of innovators.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Visual Preview */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden glass border border-white/10 shadow-2xl shadow-brand-primary/5 group h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ProductBadge className="absolute bottom-8 left-8 z-20 shadow-2xl" />
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Comparison Table Section */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Choose Your Tier</h2>
            <p className="text-white/40">Start with the free blueprint, or get the complete engineering package.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Free Tier */}
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/5 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Basic Access</h3>
              <div className="text-3xl font-bold text-white mb-8">Free</div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {product.comparisonFree.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                    <Check size={18} className="text-white/40 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {product.comparisonPremium.slice(0, 2).map((feature, idx) => (
                  <li key={`missing-${idx}`} className="flex items-start gap-3 text-sm text-white/20">
                    <X size={18} className="shrink-0 mt-0.5" />
                    <span className="line-through">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={handleFreeDownload}
                disabled={isDownloading}
                className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all font-bold text-sm flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Download size={16} /> Get Free Version</>
                )}
              </button>
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-[2.5rem] border border-brand-primary/30 bg-brand-primary/5 shadow-[0_0_50px_rgba(0,194,255,0.05)] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-brand-primary">Complete Package</h3>
                {hasDiscount && (
                  <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-3 mb-8">
                <div className="text-4xl font-bold text-white">${product.salePrice || product.basePrice}</div>
                {hasDiscount && (
                  <div className="text-lg text-white/30 line-through">${product.basePrice}</div>
                )}
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {product.comparisonFree.map((feature, idx) => (
                  <li key={`inc-${idx}`} className="flex items-start gap-3 text-sm text-white/80">
                    <Check size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {product.comparisonPremium.map((feature, idx) => (
                  <li key={`prem-${idx}`} className="flex items-start gap-3 text-sm text-white font-medium">
                    <Zap size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={handlePremiumUpgrade}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-white text-black transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20 group"
              >
                {isCheckingOut ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Upgrade to Premium <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/30 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> Secure Stripe Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultMode="signup" />
    </motion.div>
  );
};
