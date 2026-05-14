import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ChevronRight, Github, Linkedin, Youtube, ArrowRight, Heart } from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { Container } from "@/src/components/ui/Container";
import { useScrollToSection } from "@/src/hooks/useScrollToSection";
import { SupportModal } from "../components/ui/SupportButton";
import { AuthModal } from "../components/ui/AuthModal";
import { auth, onAuthStateChanged, signOut } from "../firebase";

export const Navbar = ({ onPortfolioClick }: { onPortfolioClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollToSection } = useScrollToSection();

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Active section detection with improved threshold logic
      const sections = ['home', 'projects', 'latest-blogs', 'contact'];
      let current = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Offset for navbar height and threshold
          if (rect.top <= 120) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/#home", id: "home" },
    { name: "Projects", href: "/projects", id: "projects" },
    { name: "Lab", href: "/products", id: "products" },
    { name: "Blog", href: "/blog", id: "latest-blogs" },
    { name: "About", href: "/about", id: "about" },
    { name: "Contact", href: "/contact", id: "contact" },
  ];

  const handleNavClick = (link: any) => {
    setIsMobileMenuOpen(false);
    if (link.href.startsWith("/#")) {
      const id = link.href.split("#")[1];
      scrollToSection(id);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-[1000] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
      isScrolled 
        ? "bg-black/40 backdrop-blur-2xl py-3 border-b border-white/5" 
        : "bg-transparent py-5 sm:py-10"
    )}>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-brand-primary/20 via-brand-primary to-brand-primary/20 origin-left"
        style={{ scaleX }}
      />

      <Container className="flex items-center justify-between gap-8">
        {/* Logo with intelligent home behavior */}
        <Link 
          to="/" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              scrollToSection('home');
            }
          }}
          className="text-2xl font-display font-extrabold tracking-tighter shrink-0 flex items-center gap-1 group relative z-10"
        >
          <motion.span 
            initial={false}
            animate={{ scale: isScrolled ? 0.9 : 1 }}
            className="transition-transform duration-500"
          >
            ayushpaul<span className="text-brand-primary group-hover:neon-glow-blue transition-all">.in</span>
          </motion.span>
        </Link>

        {/* Desktop Menu - Centered Architecture */}
        <div className="hidden lg:flex items-center bg-white/[0.02] border border-white/[0.05] rounded-full px-1.5 py-1 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => handleNavClick(link)}
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 cursor-pointer relative px-6 py-3 rounded-full group overflow-hidden block",
                (location.pathname === link.href || (location.pathname === '/' && activeSection === link.id))
                  ? "text-white" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <span className="relative z-10">{link.name}</span>
              {(location.pathname === link.href || (location.pathname === '/' && activeSection === link.id)) && (
                <motion.div 
                  layoutId="nav-pill"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Link>
          ))}
        </div>

        {/* Right Action CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/lab/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`} 
                  alt="Avatar" 
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Lab</span>
              </Link>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all duration-500 cursor-pointer shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
            >
              Sign In
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSupportModalOpen(true)}
            className="px-6 py-2.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all duration-500 cursor-pointer flex items-center gap-2 group"
          >
            Support <Heart size={14} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white relative z-[600] w-12 h-12 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all active:scale-90"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </Container>

      {/* Mobile Menu Slide-out */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[10000] lg:hidden overflow-hidden">
              {/* Glass Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-xl cursor-pointer"
              />
              
              {/* Modern Slide-out Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                className="absolute top-0 right-0 bottom-0 w-[88%] max-w-sm bg-[#0A0A0A] border-l border-white/10 flex flex-col shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between p-8 border-b border-white/5">
                    <span className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">Navigation</span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 active:scale-90 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* High-Signal Nav Links */}
                  <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1 custom-scrollbar">
                    {navLinks.map((link, i) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => handleNavClick(link)}
                        className={cn(
                          "group flex items-center justify-between w-full p-4 rounded-[20px] transition-all duration-300",
                          (location.pathname === link.href || (location.pathname === '/' && activeSection === link.id))
                            ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                            : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <span className="text-xl font-display font-bold tracking-tight">{link.name}</span>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                          (location.pathname === link.href || (location.pathname === '/' && activeSection === link.id))
                            ? "bg-brand-primary text-black scale-100" 
                            : "bg-white/5 text-white/20 opacity-0 group-hover:opacity-100"
                        )}>
                          <ChevronRight size={16} />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-10 border-t border-white/5 bg-gradient-to-t from-brand-primary/[0.03] to-transparent space-y-10">
                    <div className="flex items-center justify-center gap-8">
                      {[
                        { icon: <Github size={22} />, href: "https://github.com/guchchi" },
                        { icon: <Linkedin size={22} />, href: "https://www.linkedin.com/in/paulayush/" },
                        { icon: <Youtube size={22} />, href: "https://www.youtube.com/@ALX-17" }
                      ].map((social, i) => (
                        <motion.a 
                          key={i} 
                          whileHover={{ y: -3, color: "var(--color-brand-primary)" }}
                          href={social.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white/30 transition-colors"
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSupportModalOpen(true);
                      }}
                      className="w-full py-4 bg-white text-black rounded-[20px] font-bold text-base shadow-xl shadow-white/5 flex items-center justify-center gap-3"
                    >
                      Support <Heart size={18} />
                    </motion.button>
                    
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">Engineered by <span className="sr-only">Ayush Paul</span></p>
                      <div className="flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest text-brand-primary/40">
                        <span className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
                        Status: Active
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
      <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};
