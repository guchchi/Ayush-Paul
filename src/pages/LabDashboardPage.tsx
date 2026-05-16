import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Download, Bell, Sparkles, ChevronRight, Zap, ShieldCheck, LogOut } from 'lucide-react';
import { auth, onAuthStateChanged, signOut, db, collection, query, where, getDocs, doc, getDoc } from '../firebase';
import { useSEO } from '../hooks/useSEO';
import { ProductCard } from '../components/ui/ProductCard';
import { Product } from '../types';
import { getPublishedProducts } from '../lib/product-utils';
import { useAnalytics } from '../hooks/useAnalytics';

export const LabDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [ownedProducts, setOwnedProducts] = useState<Product[]>([]);
  const [discoverProducts, setDiscoverProducts] = useState<Product[]>([]);

  const { trackEvent } = useAnalytics();

  useSEO({
    title: "My Innovation Lab | Ayush Paul",
    description: "Your private workspace for downloaded blueprints and digital assets.",
  });

  useEffect(() => {
    trackEvent('lab_visit');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profileSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setProfile(profileData);
          
          const ownedMap = profileData?.ownedProducts || {};
          const ownedIds = Object.keys(ownedMap);
          console.log("[Lab] Profile found. Owned IDs:", ownedIds);
          
          const allProducts = await getPublishedProducts();
          console.log("[Lab] All Products from DB:", allProducts.map(p => p.id));
          
          const filtered = allProducts.filter(p => ownedIds.includes(p.id));
          console.log("[Lab] Filtered Owned Products:", filtered.map(p => p.id));
          
          setOwnedProducts(filtered);
          setDiscoverProducts(allProducts.filter(p => ownedMap[p.id] !== 'premium' && p.type !== 'free'));
        } else {
          setOwnedProducts([]);
          const allProducts = await getPublishedProducts();
          setDiscoverProducts(allProducts.filter(p => p.type !== 'free'));
        }
      } else {
        navigate('/'); // Redirect to home if not logged in
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleDownload = async (product: Product) => {
    if (!product.downloadFileURL) return;
    
    trackEvent('file_download', {
      product_id: product.id,
      product_name: product.title
    });

    window.open(product.downloadFileURL, '_blank');
  };

  const isNewPurchase = new URLSearchParams(window.location.search).get('product_id');

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Verifying Identity</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-32"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Success / Onboarding Alert */}
        <AnimatePresence>
          {isNewPurchase && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-6 rounded-3xl bg-green-500/10 border border-green-500/20 overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <Zap size={24} className="text-green-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">System Unlocked Successfully</h4>
                  <p className="text-sm text-green-500/80 font-medium">Your new innovation asset has been added to your Digital Vault.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-brand-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-brand-primary/20" />
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=0D8ABC&color=fff`} 
                alt="Profile" 
                className="w-full h-full object-cover relative z-10"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Innovator Profile</span>
                <ShieldCheck size={14} className="text-brand-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {profile?.displayName || "Innovator"}
              </h1>
              <p className="text-white/40 text-sm mt-1">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Alerts / Updates */}
        <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 flex items-start sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-brand-primary shrink-0" />
            <p className="text-sm text-white/80">
              <strong className="text-white">Secure Workspace:</strong> All files are served via protected URLs. Sharing access is strictly monitored.
            </p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-white transition-colors shrink-0">
            Dismiss
          </button>
        </div>

        {/* Owned Assets (Primary Workspace) */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Package className="text-white" size={24} />
            <h2 className="text-2xl font-bold tracking-tight">Your Digital Vault</h2>
          </div>

          {ownedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedProducts.map(product => (
                <div key={product.id} className="p-6 rounded-[2rem] glass border border-white/10 flex flex-col group">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative">
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary px-2 py-1 rounded bg-brand-primary/10">
                      {product.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">
                      {profile?.ownedProducts?.[product.id] || 'Owned'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-sm text-white/40 mb-6 line-clamp-2 flex-1">{product.description}</p>
                  
                  <button 
                    onClick={() => handleDownload(product)}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Access Files
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full p-12 rounded-[2.5rem] glass border border-white/5 flex flex-col items-center justify-center text-center">
              <Package size={48} className="text-white/10 mb-6" />
              <h3 className="text-xl font-bold mb-2">Your vault is empty</h3>
              <p className="text-white/40 mb-8">You haven't downloaded or purchased any blueprints yet.</p>
              <Link to="/products" className="px-6 py-3 rounded-full bg-brand-primary text-black font-bold text-sm hover:bg-white transition-colors">
                Explore The Lab
              </Link>
            </div>
          )}
        </div>

        {/* Discovery / Upsell Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="text-brand-primary" size={24} />
              <h2 className="text-2xl font-bold tracking-tight">Discover Premium Systems</h2>
            </div>
            <Link to="/products" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {discoverProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
