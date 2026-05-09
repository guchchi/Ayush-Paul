import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Grid, User, LayoutGrid, Menu, X, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export const KingdomNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500",
          scrolled ? "w-[90%] md:w-auto" : "w-full px-6 md:w-auto"
        )}
      >
        <div className={cn(
          "glass-card border-white/10 backdrop-blur-3xl flex items-center justify-between px-6 py-4 shadow-2xl transition-all duration-500",
          scrolled ? "rounded-full bg-black/60" : "rounded-3xl bg-black/20 md:rounded-full"
        )}>
          {/* Back to Gateway Button (Visible outside Home) */}
          <AnimatePresence>
            {!isHome && (
              <motion.div
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                className="mr-6 overflow-hidden"
              >
                <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
                  <ArrowLeft size={18} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logo / OS Identity */}
          <Link to="/" className="flex items-center gap-3 magnetic-target group mr-8">
            <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/40 group-hover:bg-brand-primary group-hover:text-black transition-all">
              <Terminal size={14} />
            </div>
            <span className="font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
              AP.OS<span className="text-brand-primary animate-pulse">_</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { path: '/', label: 'Gateway', icon: <Grid size={14} /> },
              { path: '/about', label: 'Identity', icon: <User size={14} /> },
              { path: '/blog', label: 'Logs', icon: <Terminal size={14} /> },
            ].map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all magnetic-target",
                    active ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.icon} {link.label}
                  {active && (
                    <motion.div layoutId="nav-indicator" className="absolute inset-0 border border-white/20 rounded-full pointer-events-none" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action */}
          <div className="hidden md:flex ml-8">
            <Link 
              to="/collaborate" 
              className="px-6 py-2.5 rounded-full bg-brand-primary text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,194,255,0.3)] magnetic-target"
            >
              Init Connection
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#0A0A0A]/95 backdrop-blur-3xl pt-32 px-6 flex flex-col md:hidden"
          >
             <div className="flex flex-col gap-6 text-2xl font-bold tracking-tight">
                <Link to="/" onClick={() => setMenuOpen(false)} className="py-4 border-b border-white/10 text-white hover:text-brand-primary transition-colors">Gateway</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)} className="py-4 border-b border-white/10 text-white hover:text-brand-primary transition-colors">Identity</Link>
                <Link to="/blog" onClick={() => setMenuOpen(false)} className="py-4 border-b border-white/10 text-white hover:text-brand-primary transition-colors">Logs</Link>
                <Link to="/collaborate" onClick={() => setMenuOpen(false)} className="py-4 border-b border-white/10 text-brand-primary">Init Connection</Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
