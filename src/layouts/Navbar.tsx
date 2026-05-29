import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Menu, X, ChevronRight, Github, Linkedin, Youtube, ArrowRight, Heart, ChevronDown, FolderGit2, Users2, Flame, Clock, Layers, BookOpen, Trophy, Terminal } from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { Container } from "@/src/components/ui/Container";
import { useScrollToSection } from "@/src/hooks/useScrollToSection";
import { SupportModal } from "../components/ui/SupportButton";
import { AuthModal } from "../components/ui/AuthModal";
import { auth, onAuthStateChanged, signOut } from "../firebase";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
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
    { name: "Home", href: "/", id: "home" },
    { name: "Ecosystem", href: "/systems", id: "systems" },
    { name: "Blog", href: "/blog", id: "blog" },
    { name: "Contact", href: "/contact", id: "contact" },
  ];

  const exploreLinks = [
    {
      name: "Vision & About",
      href: "/about",
      description: "Ecosystem architectural vision",
      icon: Users2
    },
    {
      name: "Ecosystem Milestones",
      href: "/milestones",
      description: "System milestones & achievements",
      icon: Trophy
    },
    {
      name: "Research Papers",
      href: "/blog",
      description: "Deep tech research publications",
      icon: BookOpen
    }
  ];

  // Construct activeExploreLinks: Vision & About -> Ecosystem Milestones -> Vault (if authenticated) -> Research Papers
  const activeExploreLinks = [...exploreLinks];
  if (user) {
    activeExploreLinks.splice(2, 0, {
      name: "Vault",
      href: "/vault",
      description: "Your active digital blueprints",
      icon: Clock,
      disabled: false
    });
  }

  useEffect(() => {
    if (activeExploreLinks.some(l => location.pathname === l.href)) {
      setIsMobileExploreOpen(true);
    }
  }, [location.pathname, user]);

  const handleNavClick = (link: any, e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (link.href === '/' && location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    } else if (link.href.startsWith("/#")) {
      const id = link.href.split("#")[1];
      scrollToSection(id);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] pointer-events-none p-4 sm:p-6 md:p-8 flex items-center justify-between transition-all duration-500">
      {/* Scroll Progress Indicator - Fixed to the very top window ceiling */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary/20 via-brand-primary to-brand-primary/20 origin-left transition-opacity duration-300 pointer-events-none z-[1001]"
        style={{ scaleX, opacity: isScrolled ? 1 : 0 }}
      />

      {/* LEFT ISLAND: Independent Logo (No padding, no background) */}
      <div className="pointer-events-auto shrink-0 flex items-center z-10">
        <Link 
          to="/" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              scrollToSection('home');
            }
          }}
          className="text-xl font-display font-extrabold tracking-tighter flex items-center gap-1 group"
        >
          <motion.span 
            initial={false}
            animate={{ scale: isScrolled ? 0.9 : 1 }}
            className="transition-transform duration-500 text-white"
          >
            ayushpaul<span className="text-brand-primary group-hover:neon-glow-blue transition-all">.in</span>
          </motion.span>
        </Link>
      </div>

      {/* CENTER ISLAND: Unified Compact Glassmorphic Pill Navbar (Only navigation links) */}
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border rounded-full px-5",
        (location.pathname === '/' && !isScrolled)
          ? "bg-transparent border-transparent py-3 shadow-none backdrop-blur-none"
          : isScrolled 
            ? "bg-black/55 border-white/[0.08] py-2 sm:py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl" 
            : "bg-[#FFFFFF]/[0.02] border-white/[0.06] py-2.5 sm:py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      )}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href || (location.pathname === '/' && activeSection === link.id);
          return (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleNavClick(link, e)}
              className={cn(
                "text-[11px] font-semibold tracking-wide transition-all duration-500 cursor-pointer relative px-4 py-2 rounded-full group overflow-hidden block",
                isActive ? "text-white" : "text-white/30 hover:text-white/60"
              )}
            >
              <span className="relative z-10">{link.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="nav-pill"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                />
              )}
            </Link>
          );
        })}

        {/* Explore Dropdown Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => setIsExploreOpen(true)}
          onMouseLeave={() => setIsExploreOpen(false)}
        >
          {(() => {
            const isActiveExplore = activeExploreLinks.some(l => location.pathname === l.href);
            return (
              <button
                className={cn(
                  "text-[11px] font-semibold tracking-wide transition-all duration-500 cursor-pointer relative px-4 py-2 rounded-full flex items-center gap-1.5 group select-none outline-none",
                  isExploreOpen || isActiveExplore ? "text-white" : "text-white/30 hover:text-white/60"
                )}
              >
                <span className="relative z-10">Explore</span>
                <ChevronDown 
                  size={11} 
                  className={cn(
                    "relative z-10 transition-transform duration-500",
                    isExploreOpen ? "rotate-180 text-brand-primary" : "text-white/30 group-hover:text-white/60"
                  )}
                />
                {isActiveExplore && (
                  <motion.div 
                    layoutId="nav-pill"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  />
                )}
              </button>
            );
          })()}

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isExploreOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", damping: 20, stiffness: 200, mass: 0.8 }}
                className="absolute top-[calc(100%+12px)] right-1/2 translate-x-1/2 w-72 bg-[#0A0A0B]/95 border border-white/10 rounded-[28px] p-3 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] z-[2000] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/[0.02] to-transparent pointer-events-none" />
                <div className="flex flex-col gap-1 relative z-10">
                  {activeExploreLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    const content = (
                      <>
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5",
                          isActive 
                            ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary" 
                            : link.disabled
                              ? "bg-white/[0.01] text-white/10"
                              : "bg-white/[0.02] text-white/30 group-hover/item:text-brand-primary group-hover/item:border-brand-primary/20 group-hover/item:bg-brand-primary/5"
                        )}>
                          <Icon size={16} className={cn("transition-transform", !link.disabled && "group-hover/item:scale-110")} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={cn("text-xs font-bold tracking-wider font-display", link.disabled ? "text-white/25" : "text-white")}>{link.name}</span>
                          <span className="text-[10px] text-white/35 font-medium mt-0.5 leading-normal">{link.description}</span>
                        </div>
                      </>
                    );

                    if (link.disabled) {
                      return (
                        <div
                          key={link.name}
                          className="flex items-center gap-4 p-3 rounded-2xl border border-transparent text-white/20 select-none cursor-not-allowed bg-white/[0.01]"
                        >
                          {content}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setIsExploreOpen(false)}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group/item border border-transparent",
                          isActive 
                            ? "bg-white/[0.06] border-white/10 text-white" 
                            : "text-white/55 hover:bg-white/[0.03] hover:border-white/5 hover:text-white"
                        )}
                      >
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT ISLAND: Independent Minimalist Action Text Links (No buttons, no grouping) */}
      <div className="hidden lg:flex items-center gap-8 pointer-events-auto shrink-0 z-10">
        {/* Newcomer Get Started CTA */}
        <Link
          to="/systems"
          className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
        >
          Get Started <ArrowRight size={11} className="text-brand-primary" />
        </Link>

        {user ? (
          <Link 
            to="/vault"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`} 
              alt="Avatar" 
              className="w-5 h-5 rounded-full shrink-0 border border-white/10"
            />
            <span className="whitespace-nowrap">Vault</span>
          </Link>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer select-none bg-transparent border-none outline-none p-0"
          >
            Sign In
          </button>
        )}
        
        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-1.5 select-none bg-transparent border-none outline-none p-0"
        >
          Support <Heart size={12} className="text-brand-primary hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* MOBILE MENU TOGGLE BUTTON (Absolute Right on mobile viewports) */}
      <div className="lg:hidden pointer-events-auto flex items-center z-10">
        <button
          className="text-white w-10 h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all active:scale-90"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={18} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Menu size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

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
                    {/* Newcomer featured entry card */}
                    <Link
                      to="/systems"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between w-full p-4 mb-3 rounded-[20px] bg-brand-primary/10 border border-brand-primary/20 text-brand-primary group"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold uppercase tracking-widest">New here?</span>
                        <span className="text-base font-display font-bold tracking-tight mt-0.5">Explore the Ecosystem →</span>
                      </div>
                      <ArrowRight size={18} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {navLinks.map((link, i) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={(e) => handleNavClick(link, e)}
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

                    {/* Collapsible Explore Section */}
                    <div className="space-y-1">
                      <button
                        onClick={() => setIsMobileExploreOpen(prev => !prev)}
                        className={cn(
                          "group flex items-center justify-between w-full p-4 rounded-[20px] transition-all duration-300 text-left outline-none",
                          isMobileExploreOpen || activeExploreLinks.some(l => location.pathname === l.href)
                            ? "bg-white/5 text-white" 
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span className="text-xl font-display font-bold tracking-tight">Explore</span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 group-hover:text-white">
                          <ChevronDown 
                            size={16} 
                            className={cn("transition-transform duration-300", isMobileExploreOpen && "rotate-180 text-brand-primary")} 
                          />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isMobileExploreOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                            className="overflow-hidden pl-4 pr-2 space-y-1"
                          >
                             {activeExploreLinks.map((link) => {
                               const Icon = link.icon;
                               const isActive = location.pathname === link.href;
                               const content = (
                                 <>
                                   <div className={cn(
                                     "w-8 h-8 rounded-xl flex items-center justify-center border border-white/5",
                                     isActive 
                                       ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary" 
                                       : link.disabled
                                         ? "bg-white/[0.01] text-white/10"
                                         : "bg-white/5 text-white/30"
                                   )}>
                                     <Icon size={14} />
                                   </div>
                                   <div className="flex flex-col text-left">
                                     <span className={cn("text-sm font-bold font-display", link.disabled ? "text-white/20" : "text-white")}>{link.name}</span>
                                     <span className="text-[10px] text-white/20 font-medium mt-0.5">{link.description}</span>
                                   </div>
                                 </>
                               );

                               if (link.disabled) {
                                 return (
                                   <div
                                     key={link.name}
                                     className="flex items-center gap-4 p-3.5 rounded-2xl border border-transparent text-white/20 cursor-not-allowed bg-white/[0.01]"
                                   >
                                     {content}
                                   </div>
                                 );
                               }

                               return (
                                 <Link
                                   key={link.name}
                                   to={link.href}
                                   onClick={() => {
                                     setIsMobileMenuOpen(false);
                                     setIsMobileExploreOpen(false);
                                   }}
                                   className={cn(
                                     "flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 border border-transparent",
                                     isActive 
                                       ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary" 
                                       : "text-white/40 hover:text-white hover:bg-white/5"
                                   )}
                                 >
                                   {content}
                                 </Link>
                               );
                             })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
