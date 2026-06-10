import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatCurrency, computeSavings } from '../lib/format';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, ShieldCheck, Code, ArrowRight, Download, Check, X, Zap, Cpu, Activity, Layers, Terminal, Lock, Play, Users, BookOpen, Clock, BarChart3, Globe, Calendar, Tag, Timer } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { Product } from '../types';
import { getProductBySlug } from '../lib/product-utils';
import { auth, onAuthStateChanged, db, doc, setDoc, getDoc, serverTimestamp } from '../firebase';
import { AuthModal } from '../components/ui/AuthModal';
import { useAnalytics } from '../hooks/useAnalytics';
import { MagneticButton } from '../components/ui/MagneticButton';
import { BackButton } from '../components/ui/back-button';
import { PricingBadge } from '../components/ui/PricingBadge';
import { CouponInput, type CouponResult } from '../components/ui/CouponInput';
import { secureDownload } from '../lib/download';
import { BlueprintTrustBar } from '../components/sections/BlueprintTrustBar';
import { BlueprintStickyPanel } from '../components/sections/BlueprintStickyPanel';
import { BlueprintPreviewCarousel } from '../components/sections/BlueprintPreviewCarousel';
import { BlueprintTimeline } from '../components/sections/BlueprintTimeline';
import { BlueprintFAQ } from '../components/sections/BlueprintFAQ';
import { BlueprintAuthorSection } from '../components/sections/BlueprintAuthorSection';
import { BlueprintSocialProof } from '../components/sections/BlueprintSocialProof';
import { BlueprintRelated } from '../components/sections/BlueprintRelated';

export const BlueprintDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<'free' | 'premium'>('premium');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(() => {
    const stored = sessionStorage.getItem('pending_coupon');
    return stored ? JSON.parse(stored) : null;
  });

  // Persist coupon to sessionStorage for page refresh resilience
  useEffect(() => {
    if (appliedCoupon?.valid) {
      sessionStorage.setItem('pending_coupon', JSON.stringify(appliedCoupon));
    } else {
      sessionStorage.removeItem('pending_coupon');
    }
  }, [appliedCoupon]);

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
        trackEvent('Blueprint Viewed', { slug: data.slug, id: data.id, title: data.title });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  useSEO({
    title: product ? `${product.title} | Implementation Blueprint by Ayush Paul` : "Loading Blueprint...",
    description: product?.description || "",
    keywords: product?.tags?.join(", ") || "",
    url: getCanonicalUrl(`/blueprints/${slug}`),
    image: product?.thumbnail
  });

  const handleFreeDownload = async () => {
    if (!product) return;

    setIsDownloading(true);
    
    try {
      trackEvent('free_download', { product_id: product.id, product_name: product.title });
      
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const currentOwned = snap.exists() ? (snap.data()?.ownedProducts || {}) : {};
        currentOwned[product.id] = "free";
        await setDoc(userRef, {
          ownedProducts: currentOwned,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      const filename = product.title.replace(/\s+/g, '-').toLowerCase() + '.zip';
      await secureDownload(product.id, filename);

      setTimeout(() => navigate('/thank-you'), 1000);
    } catch (error: any) {
      alert(error.message || "Failed to process free download. Please check your connection.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePremiumUpgrade = async () => {
    if (!product) return;
    
    trackEvent('premium_intent', { product_id: product.id, product_name: product.title });
    
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckingOut(true);
    trackEvent('checkout_start', { product_id: product.id, product_name: product.title });

    try {
      const body: Record<string, any> = { productId: product.id, userId: user.uid, email: user.email };
      if (appliedCoupon?.code) body.couponCode = appliedCoupon.code;
      if (appliedCoupon?.assignedToCreator) body.creatorCode = appliedCoupon.assignedToCreator;

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        const errorMsg = data.error || "Failed to initialize checkout.";
        alert(`Checkout Error: ${errorMsg}`);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
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
        <h2 className="text-3xl font-extrabold mb-4 tracking-tighter">Blueprint Not Found</h2>
        <p className="text-[#424754] text-sm mb-8 font-semibold">The requested blueprint or configuration does not exist in the active registry.</p>
        <button 
          onClick={() => navigate('/blueprints')} 
          className="px-5 py-2.5 rounded-full bg-white border border-[#c2c6d6]/30 text-[#0b1c30] hover:bg-[#eff4ff] hover:border-[#0058be]/20 transition-all text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
        >
          Return to Blueprints Hub
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full min-h-screen bg-bg-primary text-[#0b1c30] pt-24 pb-32"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10 text-left">
            <BackButton to="/blueprints" label="Back to Blueprints" />
          </div>

          <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden shadow-sm">
            <div className="h-2 w-full" style={{ backgroundColor: '#0b1c30' }} />
            <div className="p-8 md:p-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#fff8e1] border border-[#ffe082] flex items-center justify-center mb-6">
                <Lock size={28} className="text-[#f57f17]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 text-[#0b1c30]">
                {product.title}
              </h1>
              <p className="text-[#424754] text-sm leading-relaxed max-w-lg mb-8 font-medium">
                {product.description}
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#fff8e1] border border-[#ffe082] text-[#f57f17] text-xs font-bold uppercase tracking-wider mb-8">
                <Lock size={12} />
                Coming Soon — Unlock Preview
              </div>

              <div className="max-w-md w-full p-6 bg-gray-50/50 border border-[#c2c6d6]/20 rounded-2xl text-left">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">What's Inside</h3>
                <ul className="space-y-3">
                  {(product.comparisonPremium?.length > 0 ? product.comparisonPremium : ['Ready-to-use implementation', 'Production-grade configuration', 'Step-by-step setup guide', 'Best practices & patterns']).slice(0, 4).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#424754]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d1f34d] mt-1.5 shrink-0" />
                      <span className="font-semibold">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 p-4 bg-[#eff4ff] border border-[#dce9ff] rounded-2xl text-left max-w-md w-full">
                <p className="text-[11px] text-[#0058be] font-semibold leading-relaxed">
                  This blueprint is currently in production. Preview the structure and scope above. You'll be notified as soon as it's ready for download.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-3">
                {product.author && (
                  <div className="flex items-center gap-2">
                    <img src={product.author.avatar || `https://ui-avatars.com/api/?name=${product.author.name}`} alt={product.author.name} className="w-7 h-7 rounded-full border border-[#c2c6d6]/30" />
                    <span className="text-[10px] font-bold text-[#0b1c30]">{product.author.name}</span>
                  </div>
                )}
                <span className="text-[9px] text-[#424754]/50 font-mono">// BUILDING PHASE</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary text-[#0b1c30] pt-24 pb-32"
    >
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Navigation */}
        <div className="mb-10 text-left">
          <BackButton to="/blueprints" label="Back to Blueprints" />
        </div>

        {/* ── Hero Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">

          {/* Left: Product Info */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be] px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#dce9ff]">
                {product.category}
              </span>
              <PricingBadge product={product} size="sm" showPrice />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={12} className="text-[#0058be]" /> Production Verified
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 leading-none text-[#0b1c30]">
              {product.title}
            </h1>

            <p className="text-base md:text-lg text-[#424754] leading-relaxed mb-8 max-w-xl font-medium">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-[#c2c6d6]/30 rounded-full text-[10px] font-bold text-[#424754] uppercase tracking-wider shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Author + Quick Stats inline */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {(() => {
                const authName = product.authorName || product.author?.name;
                const authRole = product.authorRole || product.author?.role;
                const authPhoto = product.authorPhoto || product.author?.avatar;
                if (!authName) return null;
                return (
                  <div className="flex items-center gap-3">
                    <img src={authPhoto || `https://ui-avatars.com/api/?name=${authName}`} alt={authName} className="w-9 h-9 rounded-full border border-[#c2c6d6]/30" />
                    <div>
                      <span className="text-sm font-extrabold text-[#0b1c30] leading-none">{authName}</span>
                      {authRole && <span className="text-[9px] text-[#424754]/60 uppercase tracking-wider font-bold block mt-0.5">{authRole}</span>}
                    </div>
                  </div>
                );
              })()}

              {(product.difficultyLevel || product.readingTime) && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-[#c2c6d6]/20" />
                  <div className="flex items-center gap-4">
                    {product.difficultyLevel && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#424754]/70">
                        <BarChart3 size={13} className="text-[#6b35ff]" />
                        <span className="capitalize">{product.difficultyLevel}</span>
                      </div>
                    )}
                    {product.readingTime && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#424754]/70">
                        <Clock size={13} className="text-[#f57f17]" />
                        {product.readingTime} min read
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Video or Image */}
          <div className="relative">
            {product.youtubeVideoId ? (
              <div className="rounded-[32px] overflow-hidden bg-white border border-[#c2c6d6]/30 shadow-sm">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${product.youtubeVideoId}`}
                    title={`${product.title} introduction`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-[32px] overflow-hidden bg-white border border-[#c2c6d6]/30 shadow-sm">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            )}

            {/* Floating badge */}
            <div className="absolute -bottom-3 -right-3 hidden sm:block">
              <div className="px-4 py-2 rounded-full bg-[#0b1c30] text-white text-[9px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                <ShieldCheck size={11} /> Premium Blueprint
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust Bar ── */}
        <BlueprintTrustBar product={product} />

        {/* ── Main Content + Sticky Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16 mt-24">

          {/* Left: Content Sections */}
          <div className="lg:col-span-2 space-y-24">

            {/* 1. What's Inside (summary cards from video section) */}
            {product.youtubeVideoId && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">
                    <Play size={12} className="inline mr-1.5 text-[#0058be]" /> Overview
                  </h2>
                  <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">What This Blueprint Covers</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                    <div className="w-9 h-9 rounded-full bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center shrink-0">
                      <Zap size={14} className="text-[#0058be]" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#0b1c30]">What it solves</p>
                      <p className="text-[11px] text-[#424754] font-semibold mt-0.5">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                    <div className="w-9 h-9 rounded-full bg-[#f0fbe8] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                      <Users size={14} className="text-[#558b2f]" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#0b1c30]">Who it's for</p>
                      <p className="text-[11px] text-[#424754] font-semibold mt-0.5">{product.tags?.slice(0, 3).join(', ') || 'Developers & technical founders'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                    <div className="w-9 h-9 rounded-full bg-[#fff8e1] border border-[#ffe082] flex items-center justify-center shrink-0">
                      <Activity size={14} className="text-[#f57f17]" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#0b1c30]">Expected outcome</p>
                      <p className="text-[11px] text-[#424754] font-semibold mt-0.5">Ready-to-use implementation with production-grade configuration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                    <div className="w-9 h-9 rounded-full bg-[#f3efff] border border-[#ebe5ff] flex items-center justify-center shrink-0">
                      <Code size={14} className="text-[#6b35ff]" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#0b1c30]">Why it was created</p>
                      <p className="text-[11px] text-[#424754] font-semibold mt-0.5">To accelerate your development with battle-tested patterns</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Blueprint Facts */}
            {[product.pageCount, product.readingTime, product.difficultyLevel, product.language, product.lastUpdated, product.version, product.estimatedImplementationTime].some(Boolean) && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Specifications</h2>
                  <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Blueprint Facts</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {product.pageCount && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                      <div className="w-9 h-9 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center shrink-0">
                        <BookOpen size={14} className="text-[#0058be]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#424754]/60 uppercase tracking-wider">Pages</p>
                        <p className="text-xs font-extrabold text-[#0b1c30]">{product.pageCount}</p>
                      </div>
                    </div>
                  )}
                  {product.readingTime && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                      <div className="w-9 h-9 rounded-xl bg-[#fff8e1] border border-[#ffe082] flex items-center justify-center shrink-0">
                        <Clock size={14} className="text-[#f57f17]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#424754]/60 uppercase tracking-wider">Reading</p>
                        <p className="text-xs font-extrabold text-[#0b1c30]">{product.readingTime} mins</p>
                      </div>
                    </div>
                  )}
                  {product.difficultyLevel && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                      <div className="w-9 h-9 rounded-xl bg-[#f3efff] border border-[#ebe5ff] flex items-center justify-center shrink-0">
                        <BarChart3 size={14} className="text-[#6b35ff]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#424754]/60 uppercase tracking-wider">Difficulty</p>
                        <p className="text-xs font-extrabold text-[#0b1c30] capitalize">{product.difficultyLevel}</p>
                      </div>
                    </div>
                  )}
                  {product.language && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                      <div className="w-9 h-9 rounded-xl bg-[#f0fbe8] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                        <Globe size={14} className="text-[#558b2f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#424754]/60 uppercase tracking-wider">Language</p>
                        <p className="text-xs font-extrabold text-[#0b1c30]">{product.language}</p>
                      </div>
                    </div>
                  )}
                  {product.lastUpdated && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                      <div className="w-9 h-9 rounded-xl bg-[#fce4ec] border border-[#f8bbd0] flex items-center justify-center shrink-0">
                        <Calendar size={14} className="text-[#c62828]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#424754]/60 uppercase tracking-wider">Updated</p>
                        <p className="text-xs font-extrabold text-[#0b1c30]">{product.lastUpdated}</p>
                      </div>
                    </div>
                  )}
                  {product.version && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                      <div className="w-9 h-9 rounded-xl bg-[#e0f7fa] border border-[#b2ebf2] flex items-center justify-center shrink-0">
                        <Tag size={14} className="text-[#00838f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#424754]/60 uppercase tracking-wider">Version</p>
                        <p className="text-xs font-extrabold text-[#0b1c30]">v{product.version}</p>
                      </div>
                    </div>
                  )}
                  {product.estimatedImplementationTime && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left">
                      <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] border border-[#c8e6c9] flex items-center justify-center shrink-0">
                        <Timer size={14} className="text-[#2e7d32]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#424754]/60 uppercase tracking-wider">Implementation</p>
                        <p className="text-xs font-extrabold text-[#0b1c30]">{product.estimatedImplementationTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Sales & Trust Sections */}
            <div className="space-y-24">

              {/* Problem This Blueprint Solves */}
              {product.problemSolved && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">The Problem</h2>
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">What This Blueprint Solves</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[32px] bg-white border border-red-200 shadow-sm relative overflow-hidden text-left">
                      <div className="absolute top-0 left-0 w-full h-1 bg-red-400" />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
                          <X size={18} className="text-red-500" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Before</span>
                      </div>
                      <p className="text-base font-semibold text-[#424754] leading-relaxed">{product.problemSolved}</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-white border border-green-200 shadow-sm relative overflow-hidden text-left">
                      <div className="absolute top-0 left-0 w-full h-1 bg-green-400" />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
                          <Check size={18} className="text-green-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">After</span>
                      </div>
                      <p className="text-base font-extrabold text-[#0b1c30] leading-relaxed">Full implementation deployed and running.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Who This Is For */}
              {product.idealFor && product.idealFor.length > 0 && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Ideal Audience</h2>
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Who This Is For</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.idealFor.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm hover:border-green-200 hover:bg-green-50/30 transition-all text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#f0fbe8] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                          <Check size={18} className="text-[#558b2f]" />
                        </div>
                        <span className="text-sm font-bold text-[#0b1c30]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Who This Is NOT For */}
              {product.notFor && product.notFor.length > 0 && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Not Recommended For</h2>
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Who This Is NOT For</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.notFor.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-red-100 shadow-sm hover:border-red-200 hover:bg-red-50/30 transition-all text-left">
                        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                          <X size={18} className="text-red-500" />
                        </div>
                        <span className="text-sm font-bold text-[#424754]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What You'll Get */}
              {product.includedResources && product.includedResources.length > 0 && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Deliverables</h2>
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">What You'll Get</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.includedResources.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm hover:border-[#0058be]/20 hover:bg-[#eff4ff]/50 transition-all text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center shrink-0">
                          <Layers size={18} className="text-[#0058be]" />
                        </div>
                        <span className="text-sm font-bold text-[#0b1c30]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expected Outcomes */}
              {product.outcomes && product.outcomes.length > 0 && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Results</h2>
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Expected Outcomes</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.outcomes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm hover:border-[#d1f34d]/40 hover:bg-[#d1f34d]/5 transition-all text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 flex items-center justify-center shrink-0">
                          <Zap size={18} className="text-[#0b1c30]" />
                        </div>
                        <span className="text-sm font-extrabold text-[#0b1c30]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {product.requirements && product.requirements.length > 0 && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Prerequisites</h2>
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Requirements</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.requirements.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm hover:border-[#6b35ff]/20 hover:bg-[#f3efff]/50 transition-all text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#f3efff] border border-[#ebe5ff] flex items-center justify-center shrink-0">
                          <ShieldCheck size={18} className="text-[#6b35ff]" />
                        </div>
                        <span className="text-sm font-bold text-[#0b1c30]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Feature breakdown */}
            {product.features && product.features.length > 0 && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Inside the Blueprint</h2>
                  <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Key Features & Asset Deliverables</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {product.features.map((feat, idx) => {
                    const featureName = typeof feat === 'string' ? feat : (feat?.name ?? '');
                    const [title, desc] = featureName.includes(": ") 
                      ? featureName.split(": ") 
                      : [featureName, ""];
                    
                    let IconComponent = Code;
                    if (idx % 4 === 0) IconComponent = Cpu;
                    else if (idx % 4 === 1) IconComponent = Zap;
                    else if (idx % 4 === 2) IconComponent = Layers;
                    else if (idx % 4 === 3) IconComponent = Terminal;

                    return (
                      <div key={idx} className="p-6 rounded-[32px] bg-white border border-[#c2c6d6]/30 hover:border-[#0058be]/20 hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 flex flex-col space-y-4 text-left group shadow-sm">
                        <div className="w-10 h-10 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0b1c30] group-hover:bg-[#d1f34d] group-hover:border-[#d1f34d] group-hover:text-black transition-all duration-300">
                          <IconComponent size={16} />
                        </div>
                        <h4 className="text-base font-extrabold tracking-tight text-[#0b1c30]">{title}</h4>
                        {desc && <p className="text-xs text-[#424754] leading-relaxed font-semibold">{desc}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Preview Carousel */}
            <BlueprintPreviewCarousel images={product.previewImages} title={product.title} />

            {/* 6. Implementation Timeline */}
            <BlueprintTimeline product={product} />

            {/* 7. FAQ */}
            <BlueprintFAQ product={product} />

            {/* 8. Author Section */}
            <BlueprintAuthorSection product={product} />

            {/* 9. Social Proof */}
            <BlueprintSocialProof product={product} />

          </div>

          {/* Right: Sticky Purchase Panel */}
          <div className="lg:col-span-1">
            <BlueprintStickyPanel
              product={product}
              selectedLicense={selectedLicense}
              onLicenseChange={setSelectedLicense}
              appliedCoupon={appliedCoupon}
              onCouponValidated={setAppliedCoupon}
              isCheckingOut={isCheckingOut}
              isDownloading={isDownloading}
              isOwned={isOwned}
              hasDiscount={hasDiscount}
              profile={profile}
              onFreeDownload={handleFreeDownload}
              onPremiumUpgrade={handlePremiumUpgrade}
            />
          </div>
        </div>

        {/* ── Related Blueprints ── */}
        <div className="border-t border-[#c2c6d6]/20 mt-24 pt-24">
          <BlueprintRelated currentProduct={product} />
        </div>

      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </motion.div>
  );
};

export default BlueprintDetailPage;
