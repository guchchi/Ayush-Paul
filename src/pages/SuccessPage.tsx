import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useAnalytics } from '../hooks/useAnalytics';
import { MagneticButton } from '../components/ui/MagneticButton';

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
      className="w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-center text-[#0b1c30]"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-8 shadow-sm text-green-600"
      >
        <CheckCircle size={44} />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-none text-[#0b1c30]">
        Payment Successful!
      </h1>
      
      <p className="text-base text-[#424754] mb-12 max-w-md font-semibold">
        {isOwned 
          ? `Success! Your ${product?.title || 'blueprint'} is unlocked and ready for download.`
          : "Thank you for supporting the Innovation Lab. Your premium blueprint has been unlocked and is waiting for you."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {isOwned && product?.downloadFileURL && (
          <MagneticButton>
            <button 
              onClick={handleDownload}
              className="px-8 py-4 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] border border-[#dce9ff] text-[#0058be] font-bold flex items-center justify-center gap-2 transition-colors shadow-sm text-xs uppercase tracking-wider h-12 cursor-pointer"
            >
              Download Now <Download size={14} />
            </button>
          </MagneticButton>
        )}
        
        <MagneticButton>
          <button 
            onClick={() => navigate('/vault')}
            className="px-8 py-4 rounded-full bg-[#0b1c30] hover:bg-[#0058be] text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-sm text-xs uppercase tracking-wider h-12 cursor-pointer"
          >
            Go to My Vault <ArrowRight size={14} />
          </button>
        </MagneticButton>
      </div>

      {!isOwned && !loading && productId && (
        <p className="mt-8 text-xs text-[#424754]/60 font-semibold">
          Not seeing the download? It can take a few seconds to process. 
          <br/>
          Check your <button onClick={() => navigate('/vault')} className="underline text-[#0058be] font-bold cursor-pointer bg-transparent border-none p-0">Vault</button> in a moment.
        </p>
      )}
    </motion.div>
  );
};

export default SuccessPage;
