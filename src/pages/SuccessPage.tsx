import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useAnalytics } from '../hooks/useAnalytics';

export const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const productId = searchParams.get('product_id');
  const [product, setProduct] = React.useState<any>(null);
  const [isOwned, setIsOwned] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useSEO({
    title: "Payment Successful | Ayush Paul Lab",
    description: "Thank you for your purchase.",
    noindex: true
  });

  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (sessionId) {
      trackEvent('purchase_success', { session_id: sessionId, product_id: productId });
    }

    const verifyAccess = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const { db, doc, getDoc, auth, onAuthStateChanged } = await import('../firebase');
        const productSnap = await getDoc(doc(db, "products", productId));
        
        if (productSnap.exists()) {
          const pData = productSnap.data();
          setProduct(pData);
        }

        let unsubscribe: (() => void) | null = null;
        let attempts = 0;
        let pollInterval: NodeJS.Timeout | null = null;

        const checkOwnership = async (uid: string) => {
          const userSnap = await getDoc(doc(db, "users", uid));
          if (userSnap.exists()) {
            const userData = userSnap.data() as any;
            return userData?.ownedProducts?.[productId] === "premium";
          }
          return false;
        };

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (!currentUser) return;

          // 1. Fallback secure API call for instantaneous checkout verification
          if (sessionId) {
            try {
              const res = await fetch('/api/verify-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, userId: currentUser.uid })
              });
              const vData = await res.json();
              if (vData.success) {
                console.log("Session verified successfully via backend API fallback.");
                setIsOwned(true);
                setLoading(false);
                if (unsubscribe) unsubscribe();
                return;
              }
            } catch (err) {
              console.error("Backend checkout verification failed:", err);
            }
          }

          // 2. Poll Firestore ownedProducts as safe backup check
          pollInterval = setInterval(async () => {
            const owned = await checkOwnership(currentUser.uid);
            if (owned) {
              setIsOwned(true);
              setLoading(false);
              if (pollInterval) clearInterval(pollInterval);
              if (unsubscribe) unsubscribe();
            } else if (attempts > 20) {
              setLoading(false);
              if (pollInterval) clearInterval(pollInterval);
              if (unsubscribe) unsubscribe();
            }
            attempts++;
          }, 500);
        });

      } catch (error) {
        console.error("Verification error:", error);
        setLoading(false);
      }
    };

    verifyAccess();
  }, [sessionId, productId, trackEvent]);

  const handleDownload = () => {
    if (!product?.downloadFileURL) return;
    const link = document.createElement('a');
    link.href = product.downloadFileURL;
    link.target = '_blank';
    link.download = product.title.replace(/\s+/g, '-').toLowerCase() + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
      >
        <CheckCircle size={48} className="text-green-500" />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
        Payment Successful!
      </h1>
      
      <p className="text-lg text-white/60 mb-12 max-w-md">
        {isOwned 
          ? `Success! Your ${product?.title || 'blueprint'} is unlocked and ready for download.`
          : "Thank you for supporting the Innovation Lab. Your premium blueprint has been unlocked and is waiting for you."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {isOwned && product?.downloadFileURL && (
          <button 
            onClick={handleDownload}
            className="px-8 py-4 rounded-full bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-brand-primary transition-colors shadow-xl"
          >
            Download Now <Download size={18} />
          </button>
        )}
        
        <button 
          onClick={() => navigate('/lab/dashboard')}
          className="px-8 py-4 rounded-full bg-brand-primary text-black font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-xl shadow-brand-primary/20"
        >
          Go to My Lab <ArrowRight size={18} />
        </button>
      </div>

      {!isOwned && !loading && productId && (
        <p className="mt-8 text-xs text-white/20">
          Not seeing the download? It can take a few seconds to process. 
          <br/>
          Check your <button onClick={() => navigate('/lab/dashboard')} className="underline">Dashboard</button> in a moment.
        </p>
      )}
    </motion.div>
  );
};
