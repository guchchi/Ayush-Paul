import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Menu, X, ChevronRight, Github, Linkedin, Youtube, Compass, ExternalLink } from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { SupportModal } from "../components/ui/SupportButton";
import { AuthModal } from "../components/ui/AuthModal";
import { auth, onAuthStateChanged } from "../firebase";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = React.useRef(0);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isBCyber = location.pathname.startsWith('/blueprints/b-cyber');
  const isNavLightText = !isHomePage;
  const isDrawerLight = false;

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);

      // Hide or show logic based on scroll direction
      if (currentScrollY <= 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
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
    { name: "Mastery", href: "/mastery" },
    { name: "Blueprints", href: "/blueprints" },
    { name: "Studio", href: "/collaborate" }
  ];

  const mobileLinks = [...navLinks];
  if (user) {
    mobileLinks.push({ name: "Vault", href: "/vault" });
  }

  return (
    <>
      {/* Custom Styles for Navbar brand-lime button to match homepage exactly */}
      <style>{`
        .brand-lime {
          background-color: #d1f34d;
          color: #000000;
        }
        .brand-lime:hover {
          background-color: #c0e045;
        }
        :root.light .nav-force-white a:not(.brand-lime),
        :root.light .nav-force-white button:not(.brand-lime),
        .nav-force-white a:not(.brand-lime),
        .nav-force-white button:not(.brand-lime) {
          color: #ffffff !important;
        }
        :root.light .nav-force-white a:not(.brand-lime):hover,
        :root.light .nav-force-white button:not(.brand-lime):hover,
        .nav-force-white a:not(.brand-lime):hover,
        .nav-force-white button:not(.brand-lime):hover {
          color: #ffffff !important;
          opacity: 0.85;
        }
        :root.light .nav-force-white a.text-white/60,
        :root.light .nav-force-white button.text-white/60,
        .nav-force-white a.text-white/60,
        .nav-force-white button.text-white/60 {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        :root.light .nav-force-white a.text-white/60:hover,
        :root.light .nav-force-white button.text-white/60:hover,
        .nav-force-white a.text-white/60:hover,
        .nav-force-white button.text-white/60:hover {
          color: #ffffff !important;
          opacity: 1 !important;
        }
        :root.light .nav-force-white .text-white,
        .nav-force-white .text-white {
          color: #ffffff !important;
        }
        :root.light .nav-force-white .border-white/10,
        .nav-force-white .border-white/10 {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        :root.light .nav-force-white .bg-white/5,
        .nav-force-white .bg-white/5 {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>

      <nav className={cn(
        isHomePage 
          ? "absolute top-10 md:top-14 left-4 md:left-6 right-4 md:right-6 z-[1000] bg-transparent border-transparent py-6"
          : "fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ease-in-out",
        !isHomePage && (isVisible ? "translate-y-0" : "-translate-y-full"),
        isBCyber
          ? "bg-white/95 border-b border-slate-200/90 backdrop-blur-md py-3 shadow-2xs"
          : (!isHomePage && (isScrolled 
              ? "bg-white/90 border-b border-[#0b1c30]/5 backdrop-blur-md py-4 shadow-sm"
              : "bg-transparent border-transparent py-6")),
        !isNavLightText && "nav-force-white"
      )}>
        {/* Scroll Progress Indicator - Fixed to the very top window ceiling */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary/20 via-brand-primary to-brand-primary/20 origin-left transition-opacity duration-300 pointer-events-none z-[1001]"
          style={{ scaleX, opacity: isScrolled ? 1 : 0 }}
        />

        {isBCyber ? (
          /* Model 1: Contextual Header Swap for B.Cyber Compass */
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-20">
            {/* Left: Brand Identity + Compass Context */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link 
                to="/" 
                className="font-bold text-lg sm:text-xl tracking-tight text-[#0b1c30] hover:opacity-80 transition-opacity"
              >
                Ayush Paul
              </Link>
              <span className="text-slate-300 font-light select-none">/</span>
              <Link 
                to="/blueprints/b-cyber"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 hover:text-brand-primary transition-colors"
              >
                <Compass className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="whitespace-nowrap">B.Cyber Compass</span>
              </Link>
            </div>

            {/* Center: The Cyber-Dock Segmented Switcher (Desktop) */}
            <nav 
              aria-label="B.Cyber Compass Pillars"
              className="hidden lg:flex items-center p-1 rounded-full bg-slate-900/[0.04] backdrop-blur-md border border-slate-900/[0.08] shadow-2xs text-xs relative"
            >
              {[
                {
                  id: 'overview',
                  step: '01',
                  label: 'Overview',
                  href: '/blueprints/b-cyber',
                  exact: true,
                  badge: null
                },
                {
                  id: 'admission',
                  step: '02',
                  label: 'Admission',
                  href: '/blueprints/b-cyber/admission',
                  exact: false,
                  badge: '2027 Shift'
                },
                {
                  id: 'roadmap',
                  step: '03',
                  label: 'Roadmap',
                  href: '/blueprints/b-cyber/roadmap',
                  exact: false,
                  badge: 'Free Labs'
                }
              ].map((pillar) => {
                const isActive = pillar.exact 
                  ? location.pathname === pillar.href
                  : location.pathname.startsWith(pillar.href);
                return (
                  <Link
                    key={pillar.id}
                    to={pillar.href}
                    className={cn(
                      "relative px-4 py-1.5 rounded-full transition-colors flex items-center gap-2 font-medium z-10 select-none text-xs",
                      isActive ? "text-white font-bold" : "text-slate-600 hover:text-slate-950 hover:bg-slate-900/[0.03]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bcyber-active-capsule"
                        className="absolute inset-0 bg-[#0b1c30] rounded-full shadow-[0_2px_8px_rgba(11,28,48,0.22)] -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className={cn(
                      "text-[10px] font-mono font-bold tracking-tight transition-colors",
                      isActive ? "text-[#d1f34d]" : "text-slate-400"
                    )}>
                      {pillar.step}
                    </span>
                    <span>{pillar.label}</span>
                    {pillar.badge && (
                      <span className={cn(
                        "text-[9px] font-mono px-2 py-0.5 rounded-full border font-semibold transition-colors leading-none",
                        isActive 
                          ? "bg-white/15 text-white/95 border-white/20" 
                          : "bg-slate-200/70 text-slate-600 border-slate-300/40"
                      )}>
                        {pillar.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Contextual Actions & Exit to Site */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href="https://iitk.ac.in/wsais/b-cyber.php"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-1"
                title="Official IIT Kanpur WSAIS portal"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <Link
                to="/blueprints"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 transition-all shadow-2xs"
              >
                <span>← All Blueprints</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center">
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-all active:scale-90"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                aria-label="Toggle navigation menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <X size={16} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Menu size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Navbar for other pages */
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 flex justify-between items-center relative z-20">
            {/* Logo */}
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-2 font-bold text-2xl tracking-tight transition-all duration-300 hover:scale-[1.02]",
                isNavLightText ? "text-[#0b1c30]" : "text-white"
              )}
            >
              Ayush Paul
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex gap-12 items-center text-sm font-semibold tracking-widest uppercase">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.href);
                return (
                  <Link 
                    key={link.name} 
                    className={cn(
                      "transition-colors duration-300",
                      isActive
                        ? isNavLightText ? "text-[#0b1c30]" : "text-white"
                        : isNavLightText ? "text-[#0b1c30]/60 hover:text-[#0b1c30]" : "text-white/60 hover:text-white"
                    )} 
                    to={link.href}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Right Side */}
            <div className="hidden md:flex items-center gap-8">
              {user ? (
                <Link 
                  to="/vault"
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105",
                    isNavLightText ? "text-[#0b1c30]/60 hover:text-[#0b1c30]" : "text-white/60 hover:text-white"
                  )}
                >
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email || 'user'}&background=0D8ABC&color=fff`} 
                    alt="Avatar" 
                    className="w-5 h-5 rounded-full shrink-0 border border-white/10"
                  />
                  <span className="whitespace-nowrap">Vault</span>
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 cursor-pointer bg-transparent border-none outline-none p-0",
                    isNavLightText ? "text-[#0b1c30]/60 hover:text-[#0b1c30]" : "text-white/60 hover:text-white"
                  )}
                >
                  Sign In
                </button>
              )}

              <Link 
                className="brand-lime px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-sm inline-flex items-center" 
                to="/collaborate"
              >
                Start Building
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full border transition-all active:scale-90",
                  isNavLightText 
                    ? "text-black bg-black/5 border-black/10 hover:bg-black/10"
                    : "text-white bg-white/5 border-white/10 hover:bg-white/10"
                )}
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <X size={18} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Menu size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Drawer Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[10000] md:hidden overflow-hidden">
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
                className={cn(
                  "absolute top-0 right-0 bottom-0 w-[88%] max-w-sm flex flex-col shadow-2xl transition-colors duration-300",
                  isDrawerLight 
                    ? "bg-white border-l border-gray-200 text-black" 
                    : "bg-[#121212] border-l border-white/5 text-white"
                )}
              >
                <div className="flex flex-col h-full">
                  {/* Drawer Header */}
                  <div className={cn(
                    "flex items-center justify-between p-6 border-b",
                    isDrawerLight ? "border-gray-100" : "border-white/5"
                  )}>
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-[0.3em]",
                      isDrawerLight ? "text-black/40" : "text-white/30"
                    )}>Navigation</span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all",
                        isDrawerLight 
                          ? "bg-gray-100 text-black" 
                          : "bg-white/5 text-white/70"
                      )}
                    >
                      <X size={18} />
                    </button>
                  </div>
 
                  {/* Navigation Links */}
                  <div className="flex-1 overflow-y-auto py-6 px-6 space-y-2 custom-scrollbar">
                    {/* If in B.Cyber Compass, show pillars first */}
                    {isBCyber && (
                      <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#d1f34d] font-bold px-1 mb-2">
                          🧭 B.Cyber Compass Pillars
                        </div>
                        {[
                          { name: "01 Overview", href: "/blueprints/b-cyber", badge: null },
                          { name: "02 Admission Guide", href: "/blueprints/b-cyber/admission", badge: "2027 Shift" },
                          { name: "03 Preparation Roadmap", href: "/blueprints/b-cyber/roadmap", badge: "Free Labs" }
                        ].map((pillar) => {
                          const isActive = location.pathname === pillar.href || (pillar.href !== '/blueprints/b-cyber' && location.pathname.startsWith(pillar.href));
                          return (
                            <Link
                              key={pillar.name}
                              to={pillar.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center justify-between w-full p-3.5 rounded-xl border transition-all text-sm font-semibold",
                                isActive
                                  ? "bg-[#d1f34d]/15 text-[#d1f34d] border-[#d1f34d]/30 font-bold"
                                  : "bg-white/5 text-slate-200 border-white/5 hover:bg-white/10"
                              )}
                            >
                              <span>{pillar.name}</span>
                              {pillar.badge && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {pillar.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {mobileLinks.map((link) => {
                      const isActive = location.pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "group flex items-center justify-between w-full p-4 rounded-[20px] transition-all duration-300 border",
                            isActive
                              ? isDrawerLight 
                                ? "bg-black/5 text-black border-black/10"
                                : "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                              : isDrawerLight
                                ? "text-black/60 hover:text-black hover:bg-gray-50 border-transparent"
                                : "text-white/40 hover:text-white hover:bg-white/5 border-transparent"
                          )}
                        >
                          <span className="text-lg font-bold tracking-tight uppercase">{link.name}</span>
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            isActive
                              ? isDrawerLight
                                ? "bg-black text-white"
                                : "bg-brand-primary text-black"
                              : isDrawerLight
                                ? "bg-gray-100 text-black/30 group-hover:text-black"
                                : "bg-white/5 text-white/20 group-hover:text-white"
                          )}>
                            <ChevronRight size={16} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
 
                  {/* Drawer Footer */}
                  <div className={cn(
                    "p-8 border-t space-y-8",
                    isDrawerLight 
                      ? "border-gray-100 bg-[#FAFAFA]" 
                      : "border-white/5 bg-white/[0.01]"
                  )}>
                    <div className="flex items-center justify-center gap-8">
                      {[
                        { icon: <Github size={20} />, href: "https://github.com/guchchi" },
                        { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/paulayush/" },
                        { icon: <Youtube size={20} />, href: "https://www.youtube.com/@ALX-17" }
                      ].map((social, i) => (
                        <motion.a 
                          key={i} 
                          whileHover={{ y: -3 }}
                          href={social.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={cn(
                            "transition-colors",
                            isDrawerLight ? "text-black/40 hover:text-black" : "text-white/30 hover:text-white"
                          )}
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>
 
                    <Link
                      to="/collaborate"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-4 bg-[#d1f34d] text-black hover:bg-black hover:text-white rounded-[20px] font-bold text-center text-xs uppercase tracking-widest transition-colors duration-300 block shadow-sm"
                    >
                      Start Building
                    </Link>
 
                    {!user ? (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className={cn(
                          "w-full text-center text-xs font-bold uppercase tracking-widest bg-transparent border-none outline-none py-2 block transition-colors",
                          isDrawerLight ? "text-black/60 hover:text-black" : "text-white/60 hover:text-white"
                        )}
                      >
                        Sign In
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsSupportModalOpen(true);
                        }}
                        className={cn(
                          "w-full text-center text-xs font-bold uppercase tracking-widest bg-transparent border-none outline-none py-2 block transition-colors",
                          isDrawerLight ? "text-black/60 hover:text-black" : "text-white/60 hover:text-white"
                        )}
                      >
                        Support
                      </button>
                    )}
                    
                    <div className="text-center space-y-2">
                      <p className={cn(
                        "text-[9px] font-bold uppercase tracking-[0.4em]",
                        isDrawerLight ? "text-black/10" : "text-white/10"
                      )}>Engineered by <span className="sr-only">Ayush Paul</span></p>
                      <div className={cn(
                        "flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest",
                        isDrawerLight ? "text-black/40" : "text-brand-primary/40"
                      )}>
                        <span className={cn(
                          "w-1 h-1 rounded-full animate-pulse",
                          isDrawerLight ? "bg-black" : "bg-brand-primary"
                        )} />
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
    </>
  );
};
