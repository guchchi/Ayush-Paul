import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Github, ShieldCheck, Code, ArrowRight, Download, Lock, Check, X, Zap, Cpu, Activity, Layers, Terminal } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { Product } from '../types';
import { getProductBySlug } from '../lib/product-utils';
import { auth, onAuthStateChanged, db, doc, setDoc, getDoc, serverTimestamp } from '../firebase';
import { AuthModal } from '../components/ui/AuthModal';
import { useAnalytics } from '../hooks/useAnalytics';

export const SystemDetailPage = () => {
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
      if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  useSEO({
    title: product ? `${product.title} | Software System by Ayush Paul` : "Loading System...",
    description: product?.description || "",
    keywords: product?.tags?.join(", ") || "",
    url: getCanonicalUrl(`/systems/${slug}`),
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
        await setDoc(userRef, {
          ownedProducts: { [product.id]: "free" },
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
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, userId: user.uid, email: user.email }),
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
      <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold mb-4">System Node Not Found</h2>
        <p className="text-white/40 mb-8">The requested software system does not exist in the active ecosystem registry.</p>
        <button onClick={() => navigate('/systems')} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold">
          Return to Ecosystem Hub
        </button>
      </div>
    );
  }

  const isFree = product.type === 'free';
  const hasDiscount = product.salePrice > 0 && product.salePrice < product.basePrice;
  const isOwned = profile?.ownedProducts?.[product.id] === 'premium' || (isFree && profile?.ownedProducts?.[product.id] === 'free');

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
          onClick={() => navigate('/systems')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-semibold tracking-wide mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Systems
        </button>

        {/* Hero Conversion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Left: Product Info & CTAs */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10">
                {product.category}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/40 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-green-400" /> Production Verified
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              {product.title}
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl">
              {product.description}
            </p>

            {/* Quick Tech Specs */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-col gap-3 mb-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">Engineered With</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-semibold text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
             {/* Author */}
            {product.author && (
              <div className="flex items-center gap-4 mt-2">
                <img src={product.author.avatar || `https://ui-avatars.com/api/?name=${product.author.name}`} alt={product.author.name} className="w-10 h-10 rounded-full border border-white/10" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{product.author.name}</span>
                  <span className="text-xs text-white/40">{product.author.role}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Visual Schematics */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl group h-full cursor-crosshair">
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

            {/* Live Interactive Telemetry HUD (Visible on Hover) */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15 flex flex-col justify-between p-6 sm:p-8 font-mono text-[9px] text-[#00C2FF] select-none pointer-events-none">
              <div className="flex justify-between items-center border-b border-[#00C2FF]/20 pb-2">
                <span className="font-bold flex items-center gap-1.5 uppercase"><Activity size={10} className="animate-pulse" /> Live Telemetry Deck</span>
                <span className="bg-[#00C2FF]/10 px-2 py-0.5 rounded text-[8px] font-bold">MONITORING</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-auto">
                <div className="flex flex-col bg-black/50 border border-white/5 p-3 rounded-2xl">
                  <span className="text-white/20 mb-1 text-[8px] uppercase tracking-wider">NODE_FREQ</span>
                  <span className="text-xs sm:text-sm font-black text-white">{telemetrySim.freq} MHz</span>
                </div>
                <div className="flex flex-col bg-black/50 border border-white/5 p-3 rounded-2xl">
                  <span className="text-white/20 mb-1 text-[8px] uppercase tracking-wider">CORE_TEMP</span>
                  <span className="text-xs sm:text-sm font-black text-white">{telemetrySim.temp} °C</span>
                </div>
                <div className="flex flex-col bg-black/50 border border-white/5 p-3 rounded-2xl">
                  <span className="text-white/20 mb-1 text-[8px] uppercase tracking-wider">BUS_VOLTAGE</span>
                  <span className="text-xs sm:text-sm font-black text-white">{telemetrySim.voltage}V</span>
                </div>
                <div className="flex flex-col bg-black/50 border border-white/5 p-3 rounded-2xl">
                  <span className="text-white/20 mb-1 text-[8px] uppercase tracking-wider">NODE_LATENCY</span>
                  <span className="text-xs sm:text-sm font-black text-white">{telemetrySim.ping} ms</span>
                </div>
              </div>

              <div className="border-t border-[#00C2FF]/20 pt-2 flex justify-between text-white/30 text-[8px]">
                <span>REF_LOCK: ESTABLISHED</span>
                <span className="animate-pulse flex items-center gap-1 text-green-400 font-bold">● SIGNAL STRONG</span>
              </div>
            </div>

            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Feature breakdown Section */}
        {product.features && product.features.length > 0 && (
          <div className="max-w-4xl mx-auto border-t border-white/5 pt-20 mb-24">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold tracking-wider text-white/40 mb-4">Inside the System</h2>
              <h3 className="text-3xl font-bold tracking-tight">Key Architectures & Capabilities</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
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
                  <div key={idx} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] transition-colors flex flex-col space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                      <IconComponent size={18} />
                    </div>
                    <h4 className="text-lg font-bold tracking-tight text-white">{title}</h4>
                    {desc && <p className="text-sm text-white/40 leading-relaxed font-medium">{desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Deployment / License Section */}
        <div className="max-w-4xl mx-auto border-t border-white/5 pt-20 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">System Access Licensing</h2>
            <p className="text-white/40 text-sm">Select system deployment node authorization tier</p>
          </div>

          {/* Segmented Pricing Toggle Switcher */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl relative">
              <button
                onClick={() => setSelectedLicense('free')}
                className={`px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all z-10 ${
                  selectedLicense === 'free' ? 'text-black bg-white shadow-lg' : 'text-white/40 hover:text-white/80'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setSelectedLicense('premium')}
                className={`px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all z-10 ${
                  selectedLicense === 'premium' ? 'text-black bg-[#00C2FF] shadow-lg shadow-[#00C2FF]/10' : 'text-white/40 hover:text-white/80'
                }`}
              >
                Premium
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {selectedLicense === 'free' ? (
              /* Free Tier Card */
              <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col relative overflow-hidden bg-black/10">
                {/* Schematic Notches */}
                <div className="absolute top-0 left-4 w-4 h-[1px] bg-white/20" />
                <div className="absolute top-4 left-0 w-[1px] h-4 bg-white/20" />

                <h3 className="text-sm font-bold text-white/50 mb-2 uppercase font-mono tracking-widest">[Starter Core License]</h3>
                <div className="text-3xl font-extrabold text-white mb-8 font-display">Free Deploy</div>
                
                {(() => {
                  const uniqueFree = Array.from(new Set(product.comparisonFree || []));
                  const uniquePrem = Array.from(new Set(product.comparisonPremium || []))
                    .filter(f => !uniqueFree.includes(f));

                  return (
                    <>
                      <div className="text-[10px] font-mono text-white/30 mb-6">{uniqueFree.length} features included</div>
                      <ul className="space-y-5 mb-10 flex-1">
                        {uniqueFree.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-white/60 leading-6">
                            <Check size={16} className="text-brand-primary shrink-0 mt-0.5" />
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                        {uniquePrem.slice(0, 2).map((feature, idx) => (
                          <li key={`missing-${idx}`} className="flex items-start gap-3 text-sm text-white/20 leading-6">
                            <X size={16} className="shrink-0 mt-0.5 text-white/10" />
                            <span className="line-through font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()}

                <button 
                  onClick={handleFreeDownload}
                  disabled={isDownloading || profile?.ownedProducts?.[product.id]}
                  className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    profile?.ownedProducts?.[product.id] ? (
                      <><ShieldCheck size={16} className="text-brand-primary" /> System Acquired</>
                    ) : (
                      <><Download size={16} /> Download Free Version</>
                    )
                  )}
                </button>
              </div>
            ) : (
              /* Premium Tier Card */
              <div className="p-8 rounded-[2.5rem] border border-brand-primary/25 bg-brand-primary/[0.02] shadow-[0_0_50px_rgba(0,194,255,0.03)] flex flex-col relative overflow-hidden bg-black/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00C2FF]" />
                
                {/* Corner marks */}
                <div className="absolute top-0 right-4 w-4 h-[1px] bg-brand-primary/45" />
                <div className="absolute top-4 right-0 w-[1px] h-4 bg-brand-primary/45" />
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-brand-primary uppercase font-mono tracking-widest">[Master CAD & Schematics]</h3>
                  {hasDiscount && (
                    <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-[#00C2FF] text-[8px] font-bold uppercase tracking-widest rounded-full font-mono">
                      Sale -{product.discountPercentage}%
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-4xl font-extrabold text-white font-display">${product.salePrice || product.basePrice}</div>
                  {hasDiscount && (
                    <div className="text-sm text-white/40 line-through font-mono">(WAS ${product.basePrice})</div>
                  )}
                </div>
                
                {(() => {
                  const uniqueFree = Array.from(new Set(product.comparisonFree || []));
                  const uniquePrem = Array.from(new Set(product.comparisonPremium || []))
                    .filter(f => !uniqueFree.includes(f));

                  return (
                    <>
                      <div className="text-[10px] font-mono text-brand-primary/60 mb-6">{uniqueFree.length + uniquePrem.length} features included</div>
                      <ul className="space-y-5 mb-10 flex-1">
                        {uniqueFree.map((feature, idx) => (
                          <li key={`inc-${idx}`} className="flex items-start gap-3 text-sm text-white/80 leading-6">
                            <Check size={16} className="text-brand-primary shrink-0 mt-0.5" />
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                        {uniquePrem.map((feature, idx) => (
                          <li key={`prem-${idx}`} className="flex items-start gap-3 text-sm text-white font-semibold leading-6">
                            <Zap size={16} className="text-brand-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()}

                <button 
                  onClick={handlePremiumUpgrade}
                  disabled={isCheckingOut || profile?.ownedProducts?.[product.id] === 'premium'}
                  className="w-full py-4 rounded-xl bg-[#00C2FF] hover:bg-white text-black transition-all font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20 group"
                >
                  {isCheckingOut ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    profile?.ownedProducts?.[product.id] === 'premium' ? (
                      <><ShieldCheck size={16} /> Full System Unlocked</>
                    ) : (
                      <>Deploy Full System <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                    )
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Choosing guide */}
        <div className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-3 text-[11px] font-medium text-white/35 text-center">
          <div className="flex-1 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="font-bold text-white/55">Free</span> — great for learning, prototyping, or exploring the codebase.
          </div>
          <div className="flex-1 px-4 py-3 rounded-xl bg-brand-primary/[0.03] border border-brand-primary/10">
            <span className="font-bold text-brand-primary">Premium</span> — full CAD schematics, firmware, and production-ready source.
          </div>
        </div>

      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </motion.div>
  );
};

export default SystemDetailPage;
