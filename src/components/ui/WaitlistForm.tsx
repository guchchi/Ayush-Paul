import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

export const WaitlistForm = ({ context = "general" }: { context?: string }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, "subscribers"), {
        email,
        context,
        timestamp: serverTimestamp(),
        source: window.location.pathname
      });
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error("Waitlist Error:", err);
      setStatus('error');
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
            className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-sm"
          >
            <CheckCircle2 size={18} />
            <span>Success! You're in the lab queue.</span>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            onSubmit={handleSubmit}
            className="relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-brand-primary transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="Join the blueprint waitlist..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-32 py-4 text-sm font-medium outline-none focus:border-brand-primary focus:bg-white/[0.08] transition-all"
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-brand-primary text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
            >
              {status === 'loading' ? (
                <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>Join <ArrowRight size={14} /></>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === 'error' && (
        <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">Network Error. Try again.</p>
      )}
    </div>
  );
};
