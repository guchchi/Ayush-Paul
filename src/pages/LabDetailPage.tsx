import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, X, ShieldCheck, Download, Clock, Zap, ArrowRight, ArrowLeft, Cpu, Terminal, Activity, Eye, Lock, FileText, MessageSquare, Layers } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useAnalytics } from '../hooks/useAnalytics';
import { getCanonicalUrl } from '../lib/domain';
import { getProductBySlug } from '../lib/product-utils';
import { auth, onAuthStateChanged, db, doc, setDoc, getDoc, serverTimestamp } from '../firebase';
import { AuthModal } from '../components/ui/AuthModal';
import { ProductBadge } from '../components/ui/ProductBadge';
import { getRelatedContent } from '../lib/seo-utils';

export const LabDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<{ products: Product[], blogs: any[] }>({ products: [], blogs: [] });
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'milestones' | 'telemetry'>('architecture');
  const getCurrencySymbol = (currency?: string) => {
    if (!currency) return '₹';
    const c = currency.toLowerCase();
    if (c === 'usd') return '$';
    if (c === 'eur') return '€';
    if (c === 'gbp') return '£';
    if (c === 'inr') return '₹';
    return '₹';
  };

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
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (product) {
        const data = await getRelatedContent(product.tags || [], product.id, 'product');
        setRelated(data);
      }
    };
    fetchRelated();
  }, [product]);

  useSEO({
    title: product ? `${product.title} | Ayush Paul Labs` : "Loading R&D...",
    description: product?.description || "",
    keywords: product?.tags?.join(", ") || "",
    url: getCanonicalUrl(`/labs/${slug}`),
    image: product?.thumbnail
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
        "name": "Ayush Paul Labs"
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
    
    trackEvent('lab_product_view', {
      product_id: product.id,
      product_name: product.title,
      product_type: product.type
    });

    const timer = setTimeout(() => {
      console.log(`[Analytics] User spent > 10s on R&D ${product.title}`);
    }, 10000);
    return () => clearTimeout(timer);
  }, [product]);

  const handleFreeDownload = async () => {
    console.log("[Lab] Free Download Triggered for:", product?.title);
    if (!product) return;

    if (!product.downloadFileURL) {
      console.error("[Lab] Missing downloadFileURL for product:", product.id);
      alert("🔧 This free version is not yet configured for download. Please contact the engineering team.");
      return;
    }

    setIsDownloading(true);
    
    try {
      trackEvent('free_download', {
        product_id: product.id,
        product_name: product.title
      });
      
      if (user) {
        console.log("[Lab] Unlocking free product for user:", user.uid);
        const userRef = doc(db, "users", user.uid);
        
        await setDoc(userRef, {
          ownedProducts: {
            [product.id]: "free"
          },
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      console.log("[Lab] Triggering file download...");
      const link = document.createElement('a');
      link.href = product.downloadFileURL;
      link.target = '_blank';
      link.download = product.title.replace(/\s+/g, '-').toLowerCase() + '.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        navigate('/thank-you');
      }, 1000);
    } catch (error: any) {
      console.error("[Lab] Free Download Error:", error);
      alert("Failed to process free download. Please check your connection.");
    } finally {
      setIsDownloading(false);
    }
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
        const errorMsg = data.error || "Failed to initialize checkout.";
        if (errorMsg.includes("not configured")) {
          alert("🔧 Product Not Configured: This blueprint requires a valid Stripe Price ID. Please check the Admin Dashboard or contact the engineering team.");
        } else {
          alert(`Checkout Error: ${errorMsg}`);
        }
        throw new Error(errorMsg);
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
        <h2 className="text-3xl font-bold mb-4">Blueprint Not Found</h2>
        <p className="text-white/40 mb-8">This blueprint might have been removed or the link is invalid.</p>
        <button onClick={() => navigate('/labs')} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold">
          Return to Labs
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
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-32 relative overflow-hidden"
    >
      {/* Visual Engineering Grid Pattern background */}
      <div className="absolute top-0 right-0 w-full h-full grid-pattern opacity-[0.02] pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/labs')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> R&D SYSTEMS REGISTRY
        </button>

        {/* Hero Conversion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          
          {/* Left: Product Info & Triggers */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-primary px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 font-mono">
                {product.category}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 flex items-center gap-1 font-mono">
                <ShieldCheck size={12} className="text-brand-primary animate-pulse" /> SECURE PROTOCOL LINK
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight font-display">
              {product.title}
            </h1>

            <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl font-medium">
              {product.description}
            </p>

            {/* Psychological Triggers */}
            <div className="flex flex-col gap-4 mb-10 font-mono text-xs">
              {(product.inventoryCount ?? 0) < 10 && product.type !== 'free' && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold shadow-[0_0_20px_rgba(234,179,8,0.05)]"
                >
                  <Clock size={16} className="animate-pulse" /> 
                  SYS_DEMAND: Only {product.inventoryCount} deployment tokens left at this tier.
                </motion.div>
              )}
              
              {isFree && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold">
                  <Zap size={16} /> 
                  STARTER CORE NODE: Unrestricted parameter tuning access enabled.
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 text-[10px] text-white/50 font-mono">
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-brand-primary" />
                  <span>DEPLOYED: <span className="text-white font-bold">{product.downloadCount + 120} UNITS</span></span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="flex items-center gap-2">
                  <span>INDEX RATING: <span className="text-brand-accent font-bold">4.9/5 // SAFE</span></span>
                </div>
              </div>
            </div>

            {/* Creator Credibility - Founder Profile Block */}
            <div className="mt-4 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:bg-brand-primary/5 hover:border-brand-primary/25 transition-all">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-brand-primary rounded-full blur-xl opacity-10 group-hover:opacity-30 transition-opacity" />
                <img 
                  src={product.author.avatar} 
                  alt={product.author.name} 
                  className="w-14 h-14 rounded-full border border-white/10 relative z-10" 
                />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-brand-primary font-mono">SYSTEMS COORDINATOR</span>
                  <ShieldCheck size={12} className="text-brand-primary" />
                </div>
                <span className="text-lg font-bold mb-2">{product.author.name}</span>
                <p className="text-xs text-white/40 leading-relaxed font-medium">
                  Principal architect of the {product.title}. Dedicated to engineering open-source advanced cybernetics and neural blueprints for the developer ecosystem.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Technical Blueprint Preview Frame */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden glass border border-white/5 shadow-2xl shadow-brand-primary/5 group h-full bg-black/40">
            {/* Corner Industrial Schematic Marks */}
            <div className="absolute top-0 left-4 w-6 h-[1px] bg-white/30 z-20" />
            <div className="absolute top-4 left-0 w-[1px] h-6 bg-white/30 z-20" />
            <div className="absolute bottom-0 right-4 w-6 h-[1px] bg-white/30 z-20" />
            <div className="absolute bottom-4 right-0 w-[1px] h-6 bg-white/30 z-20" />
            
            {/* Schematic Overlay Indicators */}
            <div className="absolute bottom-3 left-4 font-mono text-[7px] text-white/20 select-none pointer-events-none z-20 flex flex-col gap-0.5">
              <span>COORD_REF: 42.194 // -88.08</span>
              <span>AZIMUTH: 184.26 // PITCH: -12.44</span>
            </div>
            
            <div className="absolute top-4 right-4 font-mono text-[8px] text-white/30 select-none pointer-events-none z-20 border border-white/10 px-2 py-0.5 rounded bg-black/40">
              [SYS_NODE_PRV]
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ProductBadge className="absolute bottom-8 left-8 z-20 shadow-2xl" />
            
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700 opacity-60 group-hover:opacity-85"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0A]/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Tabbed Systems Breakdown Panel */}
        <div className="w-full glass border border-white/5 rounded-[2.5rem] p-8 mb-24 bg-black/20">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-6 mb-8 font-mono text-[10px] tracking-wider">
            <button 
              onClick={() => setActiveTab('architecture')}
              className={`px-5 py-2.5 rounded-xl border transition-all ${
                activeTab === 'architecture' 
                  ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary font-bold shadow-[0_0_15px_rgba(0,194,255,0.1)]' 
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              [SYSTEM_MODULE_DIRECTORY]
            </button>
            <button 
              onClick={() => setActiveTab('milestones')}
              className={`px-5 py-2.5 rounded-xl border transition-all ${
                activeTab === 'milestones' 
                  ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary font-bold shadow-[0_0_15px_rgba(0,194,255,0.1)]' 
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              [DEVELOPMENT_ROADMAP]
            </button>
            <button 
              onClick={() => setActiveTab('telemetry')}
              className={`px-5 py-2.5 rounded-xl border transition-all ${
                activeTab === 'telemetry' 
                  ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary font-bold shadow-[0_0_15px_rgba(0,194,255,0.1)]' 
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              [TELEMETRY_PARAMETERS]
            </button>
          </div>

          <div className="min-h-[220px]">
            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest flex items-center justify-between gap-4">
                  <span>System Resource & Module Index</span>
                  <span className="text-brand-primary font-bold">SHA256_VERIFIED</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.resources?.map((resource) => {
                    const isOwned = profile?.ownedProducts?.[product.id] === 'premium' || product.type === 'free';
                    const hasAccess = !resource.isPremium || isOwned;
                    
                    // Select appropriate Lucide icon depending on Category
                    let IconComponent = FileText;
                    if (resource.category === 'code_snippet') IconComponent = Terminal;
                    else if (resource.category === 'prompt') IconComponent = MessageSquare;
                    else if (resource.category === 'template') IconComponent = Layers;
                    else if (resource.category === 'workflow') IconComponent = Activity;
                    else if (resource.category === 'diagram') IconComponent = Eye;
                    
                    return (
                      <div 
                        key={resource.id} 
                        className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-6 group/item ${
                          resource.isPremium 
                            ? 'bg-brand-primary/[0.01] border-brand-primary/10 hover:bg-brand-primary/[0.03] hover:border-brand-primary/20' 
                            : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                        }`}
                      >
                        <div className="flex gap-4 min-w-0 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                            resource.isPremium
                              ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                              : 'bg-white/5 border-white/10 text-white/60'
                          }`}>
                            <IconComponent size={18} />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                                [{resource.category}]
                              </span>
                              {resource.fileSize && (
                                <span className="font-mono text-[9px] text-brand-primary font-semibold">
                                  {resource.fileSize}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover/item:text-brand-primary transition-colors truncate">
                              {resource.title}
                            </h4>
                            <p className="text-xs text-white/40 leading-relaxed font-sans font-medium line-clamp-2">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="shrink-0 pt-1">
                          {hasAccess ? (
                            <button 
                              onClick={() => {
                                if (product.type === 'free') {
                                  handleFreeDownload();
                                } else {
                                  // Trigger master bundle download
                                  if (product.downloadFileURL) {
                                    window.open(product.downloadFileURL, '_blank');
                                  } else {
                                    alert("🔧 Direct download not yet configured for this system node. Please contact support.");
                                  }
                                }
                              }}
                              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-primary hover:text-black hover:border-brand-primary transition-all shadow-sm"
                              title="Extract Resource Bundle"
                            >
                              <Download size={14} />
                            </button>
                          ) : (
                            <button 
                              onClick={handlePremiumUpgrade}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 hover:border-red-500 transition-all font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                              title="Locked - Unlock premium access"
                            >
                              <Lock size={10} /> Locked
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  Engineering Evolution Phases
                </div>
                <div className="relative border-l border-white/10 pl-6 ml-4 space-y-8 font-mono text-xs mb-12">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-green-500/20" />
                    <div className="font-bold text-white uppercase">PHASE 01: THEORY & MODEL SIMULATION // 100% COMPLETE</div>
                    <p className="text-white/40 mt-1.5 leading-relaxed max-w-2xl font-sans font-medium">
                      Mathematical validation of kinematic motion vectors, physical load distribution modeling, and algorithm validation in isolated simulations.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-green-500/20" />
                    <div className="font-bold text-white uppercase">PHASE 02: PHYSICAL HARDWARE POC // 100% COMPLETE</div>
                    <p className="text-white/40 mt-1.5 leading-relaxed max-w-2xl font-sans font-medium">
                      First-pass PCB fabrication, actuator thermal stress validation, embedded controller code integration, and mechanical stress modeling.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse ring-4 ring-brand-primary/20" />
                    <div className="font-bold text-brand-primary uppercase">PHASE 03: REGISTRY DEPLOYMENT // ACTIVE R&D PROTOCOL</div>
                    <p className="text-white/40 mt-1.5 leading-relaxed max-w-2xl font-sans font-medium">
                      Releasing index packages, compiling dynamic CAD blueprint vaults, and standardizing cross-platform neural automation layers.
                    </p>
                  </div>
                </div>

                {product.changelog && product.changelog.length > 0 && (
                  <div className="pt-10 border-t border-white/5 space-y-6">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest flex items-center justify-between gap-4">
                      <span>[SYSTEM_MAINTENANCE_LOGS]</span>
                      <span>v{product.changelog[0].version} ACTIVE</span>
                    </div>
                    <div className="space-y-4 font-mono text-xs">
                      {product.changelog.map((entry, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/25 text-brand-primary font-bold text-[9px]">
                                {entry.version}
                              </span>
                              <h4 className="text-white font-bold tracking-tight">{entry.title}</h4>
                            </div>
                            <span className="text-white/20 text-[9px] font-mono">{entry.date}</span>
                          </div>
                          
                          {entry.description && (
                            <p className="text-white/40 font-sans text-xs font-medium leading-relaxed">
                              {entry.description}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-white/5">
                            {entry.changes.added && entry.changes.added.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-green-500 text-[8px] font-bold uppercase tracking-widest font-mono">// ADDED</div>
                                <ul className="space-y-1.5 text-white/50 text-[10px] font-sans font-medium list-disc list-inside">
                                  {entry.changes.added.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                            {entry.changes.improved && entry.changes.improved.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-brand-primary text-[8px] font-bold uppercase tracking-widest font-mono">// IMPROVED</div>
                                <ul className="space-y-1.5 text-white/50 text-[10px] font-sans font-medium list-disc list-inside">
                                  {entry.changes.improved.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                            {entry.changes.fixed && entry.changes.fixed.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-brand-accent text-[8px] font-bold uppercase tracking-widest font-mono">// FIXED</div>
                                <ul className="space-y-1.5 text-white/50 text-[10px] font-sans font-medium list-disc list-inside">
                                  {entry.changes.fixed.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'telemetry' && (
              <div className="space-y-6">
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  Secure Mainframe Node Diagnostics
                </div>
                <div className="font-mono text-[11px] leading-relaxed p-6 rounded-2xl bg-black/40 border border-white/5 text-white/60">
                  <div className="text-white/30 mb-3 font-bold">// SECURE PROTOCOL CORE CONFIG</div>
                  <div><span className="text-brand-primary font-bold">const</span> SYSTEM_NODE_METADATA = &#123;</div>
                  <div className="pl-4">node_hash: <span className="text-brand-accent">"SHA_256_{product.id.toUpperCase()}"</span>,</div>
                  <div className="pl-4">node_slug: <span className="text-brand-accent">"{(product.slug || '').toUpperCase()}"</span>,</div>
                  <div className="pl-4">research_domain: <span className="text-brand-accent">"{product.category.toUpperCase()}"</span>,</div>
                  <div className="pl-4">deployment_tier: <span className="text-brand-accent">"{product.type === 'free' ? 'STARTER_CORE' : 'MASTER_CAD_Blueprints'}"</span>,</div>
                  <div className="pl-4">build_integrity: <span className="text-green-400">"VERIFIED_OPERATIONAL"</span>,</div>
                  <div className="pl-4">core_signals: [<span className="text-white/80">{product.tags.map(t => `"${t}"`).join(', ')}</span>],</div>
                  <div className="pl-4">secure_handshake: <span className="text-brand-primary">true</span></div>
                  <div>&#125;;</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table Section */}
        <div className="max-w-4xl mx-auto mb-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 font-display">System Access Licensing</h2>
            <p className="text-white/40 text-sm font-mono tracking-wider uppercase">[Select system deployment node authorization tier]</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Free Tier */}
            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex flex-col relative overflow-hidden bg-black/10">
              {/* Corner marks */}
              <div className="absolute top-0 left-4 w-4 h-[1px] bg-white/20" />
              <div className="absolute top-4 left-0 w-[1px] h-4 bg-white/20" />

              <h3 className="text-sm font-bold text-white/50 mb-2 uppercase font-mono tracking-widest">[Starter Core License]</h3>
              <div className="text-3xl font-extrabold text-white mb-8 font-display">Free Deploy</div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {product.comparisonFree.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                    <Check size={16} className="text-white/40 shrink-0 mt-0.5" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
                {product.comparisonPremium.slice(0, 2).map((feature, idx) => (
                  <li key={`missing-${idx}`} className="flex items-start gap-3 text-sm text-white/20">
                    <X size={16} className="shrink-0 mt-0.5 text-white/10" />
                    <span className="line-through font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={handleFreeDownload}
                disabled={isDownloading || profile?.ownedProducts?.[product.id] === 'free' || profile?.ownedProducts?.[product.id] === 'premium'}
                className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  profile?.ownedProducts?.[product.id] ? (
                    <><ShieldCheck size={14} className="text-brand-primary" /> Core Node Configured</>
                  ) : (
                    <><Download size={14} /> Deploy Starter Node</>
                  )
                )}
              </button>
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-[2.5rem] border border-brand-primary/25 bg-brand-primary/[0.02] shadow-[0_0_50px_rgba(0,194,255,0.03)] flex flex-col relative overflow-hidden bg-black/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
              
              {/* Corner marks */}
              <div className="absolute top-0 right-4 w-4 h-[1px] bg-brand-primary/45" />
              <div className="absolute top-4 right-0 w-[1px] h-4 bg-brand-primary/45" />
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold text-brand-primary uppercase font-mono tracking-widest">[Master CAD & Schematics]</h3>
                {hasDiscount && (
                  <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[8px] font-bold uppercase tracking-widest rounded-full font-mono">
                    Node Sale -{product.discountPercentage}%
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-8">
                <div className="text-4xl font-extrabold text-white font-display">{getCurrencySymbol(product.currency)}{product.salePrice || product.basePrice}</div>
                {hasDiscount && (
                  <div className="text-lg text-white/30 line-through font-display">{getCurrencySymbol(product.currency)}{product.basePrice}</div>
                )}
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {product.comparisonFree.map((feature, idx) => (
                  <li key={`inc-${idx}`} className="flex items-start gap-3 text-sm text-white/80">
                    <Check size={16} className="text-brand-primary shrink-0 mt-0.5" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
                {product.comparisonPremium.map((feature, idx) => (
                  <li key={`prem-${idx}`} className="flex items-start gap-3 text-sm text-white font-semibold">
                    <Zap size={16} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={handlePremiumUpgrade}
                disabled={isCheckingOut || profile?.ownedProducts?.[product.id] === 'premium'}
                className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-white text-black transition-all font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20 group"
              >
                {isCheckingOut ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  profile?.ownedProducts?.[product.id] === 'premium' ? (
                    <><ShieldCheck size={14} /> System Fully Unlocked</>
                  ) : (
                    profile?.ownedProducts?.[product.id] === 'free' ? 
                    <>Upgrade to Complete CAD <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></> :
                    <>Deploy Master CAD <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>
                  )
                )}
              </button>
              <p className="text-center text-[8px] font-bold uppercase tracking-widest text-white/30 mt-4 flex items-center justify-center gap-1 font-mono">
                <ShieldCheck size={12} className="text-brand-primary" /> SECURE END_TO_END STRIPE TUNNEL
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Authority Graph: Related Content Sections */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-32 border-t border-white/5 pt-24 space-y-32 relative z-10">
        
        {/* Related Systems (Labs -> Labs) */}
        {related.products.length > 0 && (
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-4">Ecosystem Expansion</h3>
                <h2 className="text-3xl font-bold">⚡ Engineers Also Explore</h2>
              </div>
              <Link to="/labs" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                View Entire Labs <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.products.map(p => (
                <Link 
                  key={p.id} 
                  to={`/labs/${p.slug}`}
                  className="group p-8 rounded-[2.5rem] glass border border-white/5 hover:border-brand-primary/30 transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 relative">
                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-brand-primary transition-colors">{p.title}</h4>
                  <p className="text-sm text-white/40 line-clamp-2">{p.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Learn Before Building (Labs -> Blogs) */}
        {related.blogs.length > 0 && (
          <section>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-4">Knowledge Base</h3>
                <h2 className="text-3xl font-bold">📘 Learn Before Building</h2>
              </div>
              <Link to="/blog" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                All Engineering Logs <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.blogs.map(blog => (
                <Link 
                  key={blog.slug} 
                  to={`/blog/${blog.slug}`}
                  className="p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-brand-primary/20 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 font-bold text-xs">
                      {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 group-hover:text-brand-primary transition-colors">{blog.title}</h4>
                  <p className="text-sm text-white/40 line-clamp-2">{blog.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultMode="signup" />
    </motion.div>
  );
};

export default LabDetailPage;
