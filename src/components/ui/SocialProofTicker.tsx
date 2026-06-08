import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Globe, Rocket, ShieldCheck } from 'lucide-react';
import { db, collection, query, orderBy, limit, getDocs } from '../../firebase';

interface ProofEvent {
  id: string;
  type: 'purchase' | 'download';
  title: string;
  location?: string;
  timeAgo: string;
}

export const SocialProofTicker = () => {
  const [events, setEvents] = useState<ProofEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchProof = async () => {
      try {
        // Fetch last 10 public purchases for ticker telemetry
        const q = query(collection(db, "public_purchases"), orderBy("createdAt", "desc"), limit(10));
        const snapshot = await getDocs(q);
        
        const mappedEvents: ProofEvent[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'purchase',
            title: data.productTitle || data.productId || 'Blueprint',
            location: data.currency === 'inr' ? 'India' : 'International',
            timeAgo: 'Recently'
          };
        });

        // Add some variety if needed, but stick to real data
        if (mappedEvents.length > 0) {
          setEvents(mappedEvents);
        }
      } catch (err) {
        console.error("Social Proof Fetch Error:", err);
      }
    };

    fetchProof();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;

    // Show every 45 seconds
    const interval = setInterval(() => {
      setIsVisible(true);
      
      // Hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
        setCurrentIndex((prev) => (prev + 1) % events.length);
      }, 6000);

    }, 45000);

    // Initial show after 10 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 6000);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [events]);

  if (events.length === 0) return null;

  const currentEvent = events[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-8 left-8 z-[1000] hidden md:block"
        >
          <div className="flex items-center gap-4 p-4 pr-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shrink-0">
              {currentEvent.type === 'purchase' ? (
                <Rocket size={18} className="text-brand-primary" />
              ) : (
                <Zap size={18} className="text-brand-primary" />
              )}
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                  {currentEvent.type === 'purchase' ? 'Verified Acquisition' : 'System Access'}
                </span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1">
                  <Globe size={10} /> {currentEvent.location}
                </span>
              </div>
              <p className="text-xs font-medium text-white/90">
                Someone unlocked <span className="text-white font-bold">{currentEvent.title}</span>
              </p>
            </div>

            <div className="absolute top-2 right-2">
              <ShieldCheck size={12} className="text-green-500/40" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
