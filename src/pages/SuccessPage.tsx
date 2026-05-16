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
        // 1. Fetch Product Details
        const { getProductBySlug } = await import('../lib/product-utils');
        // Since we only have ID in URL, we need to find it. 
        // For now, let's assume getProductBySlug also works with IDs or we fetch from Firestore
        const { db, doc, getDoc, auth } = await import('../firebase');
        const productSnap = await getDoc(doc(db, "products", productId));
        
        if (productSnap.exists()) {
          const pData = productSnap.data();
          setProduct(pData);

          // 2. Wait for webhook (Poll for up to 10 seconds)
          let attempts = 0;
          const checkOwnership = async () => {
            const user = auth.currentUser;
            if (!user) return false;

            const userSnap = await getDoc(doc(db, "users", user.uid));
            if (userSnap.exists()) {
              const userData = userSnap.data();
              return userData.ownedProducts?.[productId] === "premium";
            }
            return false;
          };

          const poll = setInterval(async () => {
            const owned = await checkOwnership();
            if (owned) {
              setIsOwned(true);
              clearInterval(poll);
              setLoading(false);
            } else if (attempts > 20) { // 10 seconds
              clearInterval(poll);
              setLoading(false);
            }
            attempts++;
          }, 500);
        } else {
          setLoading(false);
        }
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
