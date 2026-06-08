import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, computeSavings } from '../lib/format';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, ShieldCheck, Code, ArrowRight, Download, Check, X, Zap, Cpu, Activity, Layers, Terminal, Lock } from 'lucide-react';
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
  const [telemetrySim, setTelemetrySim] = useState({
    freq: 16.0,
    temp: 42.4,
    voltage: 11.8,
    ping: 35
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetrySim(prev => ({
        freq: +(prev.freq + (Math.random() - 0.5) * 0.1).toFixed(2),
        temp: +(prev.temp + (Math.random() - 0.5) * 0.2).toFixed(1),
        voltage: +(prev.voltage + (Math.random() - 0.5) * 0.05).toFixed(2),
        ping: Math.floor(prev.ping + (Math.random() - 0.5) * 4)
      }));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

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

    if (!product.downloadFileURL) {
      alert("This version is not yet configured for download. Please contact the engineering team.");
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
        await setDoc(userRef, {
          ownedProducts: currentOwned,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      const link = document.createElement('a');
      link.href = product.downloadFileURL;
      link.target = '_blank';
      link.download = product.title.replace(/\s+/g, '-').toLowerCase() + '.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => navigate('/thank-you'), 1000);
    } catch (error: any) {
      alert("Failed to process free download. Please check your connection.");
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
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Navigation */}
        <div className="mb-10 text-left">
          <BackButton to="/blueprints" label="Back to Blueprints" />
        </div>

        {/* Hero Conversion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Left: Product Info & CTAs */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be] px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#dce9ff]">
                {product.category}
              </span>
              <PricingBadge product={product} size="sm" showPrice />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={12} className="text-[#0058be]" /> Production Verified
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-none text-[#0b1c30]">
              {product.title}
            </h1>

            <p className="text-base md:text-lg text-[#424754] leading-relaxed mb-10 max-w-xl font-medium">
              {product.description}
            </p>

            {/* Quick Tech Specs */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-col gap-3 mb-10 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60">Engineered With</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white border border-[#c2c6d6]/30 rounded-full text-[10px] font-bold text-[#424754] uppercase tracking-wider shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Author */}
            {product.author && (
              <div className="flex items-center gap-3 mt-2 text-left">
                <img src={product.author.avatar || `https://ui-avatars.com/api/?name=${product.author.name}`} alt={product.author.name} className="w-8 h-8 rounded-full border border-[#c2c6d6]/30" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c30] leading-none">{product.author.name}</span>
                  <span className="text-[10px] text-[#424754]/60 uppercase tracking-wider font-bold mt-1">{product.author.role}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Visual Schematics */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-[32px] overflow-hidden bg-white border border-[#c2c6d6]/30 shadow-sm group h-full cursor-crosshair">
            {/* Corner Industrial Schematic Marks */}
            <div className="absolute top-0 left-4 w-6 h-[1px] bg-[#c2c6d6]/40 z-20" />
            <div className="absolute top-4 left-0 w-[1px] h-6 bg-[#c2c6d6]/40 z-20" />
            <div className="absolute bottom-0 right-4 w-6 h-[1px] bg-[#c2c6d6]/40 z-20" />
            <div className="absolute bottom-4 right-0 w-[1px] h-6 bg-[#c2c6d6]/40 z-20" />
            
            {/* Schematic Overlay Indicators */}
            <div className="absolute bottom-4 left-4 font-mono text-[7px] text-[#424754]/40 select-none pointer-events-none z-20 flex flex-col gap-0.5">
              <span>COORD_REF: 42.194 // -88.08</span>
              <span>AZIMUTH: 184.26 // PITCH: -12.44</span>
            </div>
            
            <div className="absolute top-4 right-4 font-mono text-[8px] text-[#424754]/60 select-none pointer-events-none z-20 border border-[#c2c6d6]/30 px-2 py-0.5 rounded-full bg-bg-secondary">
              [SYS_NODE_PRV]
            </div>

            {/* Live Interactive Telemetry HUD (Visible on Hover) */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-15 flex flex-col justify-between p-6 sm:p-8 font-mono text-[9px] text-[#424754] select-none pointer-events-none text-left">
              <div className="flex justify-between items-center border-b border-[#c2c6d6]/20 pb-2">
                <span className="font-bold flex items-center gap-1.5 uppercase text-[#0b1c30]"><Activity size={10} className="animate-pulse text-[#0058be]" /> Live Telemetry Deck</span>
                <span className="bg-[#eff4ff] border border-[#dce9ff] px-2 py-0.5 rounded text-[8px] font-bold text-[#0058be]">MONITORING</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-auto">
                <div className="flex flex-col bg-bg-secondary border border-[#c2c6d6]/20 p-3 rounded-2xl">
                  <span className="text-[#424754]/60 mb-1 text-[8px] uppercase tracking-wider font-bold">NODE_FREQ</span>
                  <span className="text-xs sm:text-sm font-black text-[#0b1c30]">{telemetrySim.freq} MHz</span>
                </div>
                <div className="flex flex-col bg-bg-secondary border border-[#c2c6d6]/20 p-3 rounded-2xl">
                  <span className="text-[#424754]/60 mb-1 text-[8px] uppercase tracking-wider font-bold">CORE_TEMP</span>
                  <span className="text-xs sm:text-sm font-black text-[#0b1c30]">{telemetrySim.temp} °C</span>
                </div>
                <div className="flex flex-col bg-bg-secondary border border-[#c2c6d6]/20 p-3 rounded-2xl">
                  <span className="text-[#424754]/60 mb-1 text-[8px] uppercase tracking-wider font-bold">BUS_VOLTAGE</span>
                  <span className="text-xs sm:text-sm font-black text-[#0b1c30]">{telemetrySim.voltage}V</span>
                </div>
                <div className="flex flex-col bg-bg-secondary border border-[#c2c6d6]/20 p-3 rounded-2xl">
                  <span className="text-[#424754]/60 mb-1 text-[8px] uppercase tracking-wider font-bold">NODE_LATENCY</span>
                  <span className="text-xs sm:text-sm font-black text-[#0b1c30]">{telemetrySim.ping} ms</span>
                </div>
              </div>

              <div className="border-t border-[#c2c6d6]/20 pt-2 flex justify-between text-[#424754]/40 text-[8px]">
                <span>REF_LOCK: ESTABLISHED</span>
                <span className="animate-pulse flex items-center gap-1 text-[#0058be] font-bold">● SIGNAL STRONG</span>
              </div>
            </div>

            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>

        {/* Feature breakdown Section */}
        {product.features && product.features.length > 0 && (
          <div className="max-w-4xl mx-auto border-t border-[#c2c6d6]/20 pt-24 mb-24">
            <div className="text-center mb-16">
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

        {/* Deployment / License Section */}
        <div className="max-w-4xl mx-auto border-t border-[#c2c6d6]/20 pt-24 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-[#0b1c30]">Blueprint Access Options</h2>
            <p className="text-[#424754]/80 text-xs font-semibold">Select your download tier for this blueprint</p>
          </div>

          {/* Segmented Pricing Toggle Switcher */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-bg-secondary border border-[#c2c6d6]/30 rounded-full relative shadow-sm">
              <button
                onClick={() => setSelectedLicense('free')}
                className={`px-6 py-2 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider transition-all z-10 cursor-pointer ${
                  selectedLicense === 'free' ? 'text-[#0b1c30] bg-white shadow-sm' : 'text-[#424754]/60 hover:text-[#0b1c30]'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setSelectedLicense('premium')}
                className={`px-6 py-2 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider transition-all z-10 cursor-pointer ${
                  selectedLicense === 'premium' ? 'text-[#0b1c30] bg-white shadow-sm' : 'text-[#424754]/60 hover:text-[#0b1c30]'
                }`}
              >
                Premium
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {selectedLicense === 'free' ? (
              /* Free Tier Card */
              <div className="p-8 rounded-[32px] border border-[#c2c6d6]/30 bg-white flex flex-col relative overflow-hidden text-left shadow-sm">
                {/* Schematic Notches */}
                <div className="absolute top-0 left-4 w-4 h-[1px] bg-[#c2c6d6]/40" />
                <div className="absolute top-4 left-0 w-[1px] h-4 bg-[#c2c6d6]/40" />

                <h3 className="text-[9px] font-bold text-[#424754]/60 mb-2 uppercase font-mono tracking-wider">[Free Starter Sample]</h3>
                <div className="text-3xl font-extrabold text-[#0b1c30] mb-6 font-display">Free Sample</div>
                
                {(() => {
                  const uniqueFree = Array.from(new Set(product.comparisonFree || []));
                  const uniquePrem = Array.from(new Set(product.comparisonPremium || []))
                    .filter(f => !uniqueFree.includes(f));

                  return (
                    <>
                      <div className="text-[9px] font-mono text-[#424754]/60 mb-6">{uniqueFree.length} features included</div>
                      <ul className="space-y-4 mb-8 flex-1">
                        {uniqueFree.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-[#424754] leading-6">
                            <Check size={14} className="text-[#0058be] shrink-0 mt-1" />
                            <span className="font-semibold">{feature}</span>
                          </li>
                        ))}
                        {uniquePrem.slice(0, 2).map((feature, idx) => (
                          <li key={`missing-${idx}`} className="flex items-start gap-2.5 text-xs text-[#424754]/30 leading-6">
                            <X size={14} className="shrink-0 mt-1 text-[#424754]/30" />
                            <span className="line-through font-semibold text-[#424754]/40">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()}

                <MagneticButton className="w-full">
                  <button 
                    onClick={handleFreeDownload}
                    disabled={isDownloading || profile?.ownedProducts?.[product.id]}
                    className="w-full py-3.5 rounded-full bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-[#0058be]/25 border-t-[#0058be] rounded-full animate-spin" />
                    ) : (
                      profile?.ownedProducts?.[product.id] ? (
                        <><ShieldCheck size={14} className="text-[#0058be]" /> Blueprint Acquired</>
                      ) : (
                        <><Download size={14} /> Download Free Sample</>
                      )
                    )}
                  </button>
                </MagneticButton>
              </div>
            ) : (
              /* Premium Tier Card */
              <div className="p-8 rounded-[32px] border border-[#adc6ff] bg-white flex flex-col relative overflow-hidden text-left shadow-md">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#d1f34d]" />
                
                {/* Corner marks */}
                <div className="absolute top-0 right-4 w-4 h-[1px] bg-[#c2c6d6]/40" />
                <div className="absolute top-4 right-0 w-[1px] h-4 bg-[#c2c6d6]/40" />
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[9px] font-bold text-[#0b1c30] uppercase font-mono tracking-wider">[Full Blueprint & Assets Bundle]</h3>
                  {(() => {
                    const s = computeSavings(product.basePrice, product.salePrice);
                    if (!s) return null;
                    return (
                      <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-650 text-[8px] font-bold uppercase tracking-wider rounded font-mono shadow-sm">
                        Save {formatCurrency(s.amount)} ({s.percent}%)
                      </span>
                    );
                  })()}
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl font-extrabold text-[#0b1c30] font-display">{formatCurrency(product.salePrice || product.basePrice)}</div>
                  {hasDiscount && (
                    <div className="text-xs text-[#424754]/60 line-through font-mono">(WAS {formatCurrency(product.basePrice)})</div>
                  )}
                </div>
                
                {(() => {
                  const uniqueFree = Array.from(new Set(product.comparisonFree || []));
                  const uniquePrem = Array.from(new Set(product.comparisonPremium || []))
                    .filter(f => !uniqueFree.includes(f));

                  return (
                    <>
                      <div className="text-[9px] font-mono text-[#424754]/60 mb-6">{uniqueFree.length + uniquePrem.length} features included</div>
                      <ul className="space-y-4 mb-8 flex-1">
                        {uniqueFree.map((feature, idx) => (
                          <li key={`inc-${idx}`} className="flex items-start gap-2.5 text-xs text-[#424754] leading-6">
                            <Check size={14} className="text-[#0058be] shrink-0 mt-1" />
                            <span className="font-semibold">{feature}</span>
                          </li>
                        ))}
                        {uniquePrem.map((feature, idx) => (
                          <li key={`prem-${idx}`} className="flex items-start gap-2.5 text-xs text-[#0b1c30] font-extrabold leading-6">
                            <Zap size={14} className="text-black fill-[#d1f34d] shrink-0 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()}

                <CouponInput
                  onValidated={(coupon) => setAppliedCoupon(coupon)}
                  disabled={isCheckingOut}
                />

                {/* Price breakdown with coupon */}
                {(() => {
                  if (!appliedCoupon) return null;
                  const basePrice = product.salePrice || product.basePrice;
                  const discountAmount = appliedCoupon.discountType === 'percentage'
                    ? Math.round(basePrice * (appliedCoupon.value || 0) / 100)
                    : (appliedCoupon.value || 0);
                  const finalPrice = Math.max(0, basePrice - discountAmount);

                  return (
                    <div className="mt-3 p-3.5 bg-[#f0faf0] border border-[#bbf7d0] rounded-xl space-y-2">
                      <div className="flex justify-between text-xs text-[#424754]">
                        <span>Original price</span>
                        <span className="line-through">{formatCurrency(basePrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                        <span>Discount ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.value}%` : formatCurrency(discountAmount)})</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                      <div className="border-t border-[#bbf7d0] pt-2 flex justify-between text-sm font-bold text-[#0b1c30]">
                        <span>Final price</span>
                        <span>{formatCurrency(finalPrice)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="pt-1.5">
                          <span className="inline-block px-2.5 py-0.5 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                            You save {formatCurrency(discountAmount)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div style={{ height: 12 }} />

                <MagneticButton className="w-full">
                  <button 
                    onClick={handlePremiumUpgrade}
                    disabled={isCheckingOut || profile?.ownedProducts?.[product.id] === 'premium'}
                    className="w-full py-3.5 rounded-full bg-[#0b1c30] hover:bg-[#0058be] text-white transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 group shadow-sm cursor-pointer h-12"
                  >
                    {isCheckingOut ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      profile?.ownedProducts?.[product.id] === 'premium' ? (
                        <><ShieldCheck size={14} /> Full Blueprint Unlocked</>
                      ) : (
                        <>Get Full Blueprint Bundle <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>
                      )
                    )}
                  </button>
                </MagneticButton>
              </div>
            )}
          </div>
        </div>

        {/* Choosing guide */}
        <div className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-3 text-[10px] font-bold uppercase tracking-wider text-[#424754]/80 text-center">
          <div className="flex-1 px-4 py-3 rounded-2xl bg-white border border-[#c2c6d6]/30 text-[#424754]/60 shadow-sm font-semibold">
            <span className="font-bold text-[#0b1c30]">Free</span> — great for learning, prototyping, or exploring.
          </div>
          <div className="flex-1 px-4 py-3 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] shadow-sm font-semibold">
            <span className="font-bold text-[#0b1c30]">Premium</span> — full CAD schematics, firmware, and production-ready source.
          </div>
        </div>

      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </motion.div>
  );
};

export default BlueprintDetailPage;
