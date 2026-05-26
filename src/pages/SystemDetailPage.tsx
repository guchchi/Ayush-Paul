import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Github, ShieldCheck, Code, ArrowRight, Download, Lock, Check, X, Zap } from 'lucide-react';
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
          <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl group h-full">
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
                const [title, desc] = feat.name.includes(": ") 
                  ? feat.name.split(": ") 
                  : [feat.name, ""];
                return (
                  <div key={idx} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] transition-colors flex flex-col space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                      <Code size={18} />
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
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">System Access Licensing</h2>
            <p className="text-white/40 text-sm">Select system deployment node authorization tier</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col">
              <h3 className="text-sm font-bold text-white/50 mb-2 uppercase tracking-wide">Starter Core License</h3>
              <div className="text-3xl font-bold text-white mb-8">Free Deploy</div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {product.comparisonFree?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                    <Check size={16} className="text-white/40 shrink-0 mt-0.5" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
                {product.comparisonPremium?.slice(0, 2).map((feature, idx) => (
                  <li key={`missing-${idx}`} className="flex items-start gap-3 text-sm text-white/20">
                    <X size={16} className="shrink-0 mt-0.5 text-white/10" />
                    <span className="line-through font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={handleFreeDownload}
                disabled={isDownloading || profile?.ownedProducts?.[product.id]}
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-semibold text-sm flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  profile?.ownedProducts?.[product.id] ? (
                    <><ShieldCheck size={16} /> System Acquired</>
                  ) : (
                    <><Download size={16} /> Download Free Version</>
                  )
                )}
              </button>
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-[2rem] border border-white/20 bg-white/[0.04] shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Full Production License</h3>
                {hasDiscount && (
                  <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Sale -{product.discountPercentage}%
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-8">
                <div className="text-4xl font-bold text-white">${product.salePrice || product.basePrice}</div>
                {hasDiscount && (
                  <div className="text-lg text-white/30 line-through">${product.basePrice}</div>
                )}
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {product.comparisonFree?.map((feature, idx) => (
                  <li key={`inc-${idx}`} className="flex items-start gap-3 text-sm text-white/80">
                    <Check size={16} className="text-white/60 shrink-0 mt-0.5" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
                {product.comparisonPremium?.map((feature, idx) => (
                  <li key={`prem-${idx}`} className="flex items-start gap-3 text-sm text-white font-semibold">
                    <Check size={16} className="text-white shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={handlePremiumUpgrade}
                disabled={isCheckingOut || profile?.ownedProducts?.[product.id] === 'premium'}
                className="w-full py-4 rounded-xl bg-white hover:bg-white/90 text-black transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-xl group"
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
          </div>
        </div>

      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </motion.div>
  );
};

export default SystemDetailPage;
