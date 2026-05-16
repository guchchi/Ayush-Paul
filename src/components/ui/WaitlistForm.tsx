import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Zap, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, getDocs, query, where, limit } from '../../firebase';
import { cn } from '../../lib/utils';

export const WaitlistForm = ({ 
  context = "footer-waitlist",
  variant = "compact" 
}: { 
  context?: string,
  variant?: "compact" | "inline"
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    try {
      // 1. Check for duplicate (minimal fetch - 1 doc limit)
      const q = query(collection(db, "subscribers"), where("email", "==", email.toLowerCase().trim()), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setStatus('success'); // Behave as success for user privacy/friction, or handle as duplicate
        setEmail('');
        return;
      }

      // 2. Add new subscriber
      await addDoc(collection(db, "subscribers"), {
        email: email.toLowerCase().trim(),
        createdAt: serverTimestamp(),
        source: context,
        page: window.location.pathname
      });

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error("Waitlist Error:", err);
      setStatus('error');
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-5 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-sm shadow-[0_0_30px_rgba(0,194,255,0.1)]"
          >
            <CheckCircle2 size={18} />
            <span>✅ You are on the Innovation Lab waitlist.</span>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            onSubmit={handleSubmit}
            className={cn(
              "relative group",
              variant === "inline" ? "flex flex-col sm:flex-row gap-4" : ""
            )}
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-brand-primary transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-2xl pl-12 py-4 text-sm font-medium outline-none focus:border-brand-primary focus:bg-white/[0.08] transition-all text-white",
                  variant === "compact" ? "pr-36" : "pr-6"
                )}
              />
            </div>
            <button 
              type="submit"
              disabled={status === 'loading'}
              className={cn(
                "rounded-xl bg-brand-primary text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2",
                variant === "compact" 
                  ? "absolute right-2 top-2 bottom-2 px-6" 
                  : "px-10 py-4 sm:py-0"
              )}
            >
              {status === 'loading' ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>Subscribe <ArrowRight size={14} /></>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === 'error' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase tracking-widest"
        >
          <AlertCircle size={12} />
          {errorMessage}
        </motion.div>
      )}
    </div>
  );
};
