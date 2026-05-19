import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { 
  auth, googleProvider, signInWithPopup, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, db, doc, setDoc, getDoc, serverTimestamp 
} from '../../firebase';
import { useAnalytics } from '../../hooks/useAnalytics';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent, identifyUser } = useAnalytics();

  // Initialize user profile in Firestore
  const initUserProfile = async (user: any, additionalData?: any) => {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData?.name || "Innovator",
        photoURL: user.photoURL || null,
        role: "customer", // Default role
        createdAt: serverTimestamp(),
      });
      return true; // isNewUser
    }
    return false;
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      const isNewUser = await initUserProfile(result.user);
      identifyUser(result.user.uid, { email: result.user.email, name: result.user.displayName });
      
      if (isNewUser) {
        trackEvent('signup', { method: 'google' });
      } else {
        trackEvent('login', { method: 'google' });
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await initUserProfile(result.user, { name });
        identifyUser(result.user.uid, { email: result.user.email, name });
        trackEvent('signup', { method: 'email' });
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        identifyUser(result.user.uid, { email: result.user.email });
        trackEvent('login', { method: 'email' });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0A0A0A] rounded-[2.5rem] border border-white/10 shadow-2xl z-[1001] overflow-hidden"
          >
            {/* Header Graphics */}
            <div className="relative h-32 bg-brand-primary/10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]" />
              <div className="absolute top-0 right-0 p-8 text-brand-primary/20 blur-xl">
                <Zap size={120} />
              </div>
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-brand-primary/20 border border-brand-primary flex items-center justify-center shadow-[0_0_50px_rgba(0,194,255,0.3)]">
                <ShieldCheck size={32} className="text-brand-primary" />
              </div>
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/40 hover:text-white transition-colors z-20"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-8 pt-4 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {mode === 'login' ? 'Welcome Back' : 'Create Identity'}
                </h3>
                <p className="text-sm text-white/40">
                  {mode === 'login' ? 'Access your digital assets and blueprints.' : 'Join the Innovation Lab ecosystem.'}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              {/* OAuth Providers */}
              <button 
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/90 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                <span className="relative bg-[#0A0A0A] px-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                  Or use email
                </span>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input 
                      type="text" 
                      placeholder="Display Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-black font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Identity')}
                  {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  {mode === 'login' ? "Don't have an identity? Create one." : "Already have an identity? Sign in."}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
