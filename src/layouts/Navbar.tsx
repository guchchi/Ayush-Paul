import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronRight, Github, Linkedin, Youtube } from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { Container } from "@/src/components/ui/Container";
import { useScrollToSection } from "@/src/hooks/useScrollToSection";

export const Navbar = ({ onPortfolioClick }: { onPortfolioClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  const location = useLocation();
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
    { name: "Projects", href: "/#projects" },
    { name: "Expertise", href: "/#expertise" },
    { name: "Experience", href: "/#experience" },
    { name: "About", href: "/#about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/#contact" },
  ];

  const { scrollToSection } = useScrollToSection();

  const handleNavClick = (link: any) => {
    if (link.name === "Portfolio") {
      onPortfolioClick();
      setIsMobileMenuOpen(false);
    } else if (link.href.startsWith("/#")) {
      const id = link.href.split("#")[1];
      scrollToSection(id, () => setIsMobileMenuOpen(false));
    } else {
      navigate(link.href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 pt-[env(safe-area-inset-top,0px)]",
      isScrolled 
        ? "bg-[#0A0A0A]/90 backdrop-blur-xl py-4 border-b border-white/10" 
        : "bg-[#0A0A0A]/40 sm:bg-[#0A0A0A]/20 backdrop-blur-md py-5 sm:py-6"
    )}>
      <Container className="flex items-center justify-between gap-4">
        <Link to="/" className="text-xl md:text-2xl font-display font-bold tracking-tighter shrink-0 flex items-center gap-1">
          ayushpaul<span className="text-brand-primary">.in</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => {
              if (window.location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('hire')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('hire')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-all cursor-pointer"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Menu Toggle — RESTORED STATE CONTROL */}
        <button
          className="lg:hidden text-white relative z-[600] w-10 h-10 flex items-center justify-center bg-white/5 rounded-full"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Menu — PORTALED TO DOCUMENT ROOT FOR STACKING CONTEXT SAFETY */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[10000] lg:hidden">
              {/* Backdrop Overlay — Solidified bg-black/95 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-pointer pointer-events-auto"
              />
              
              {/* Sliding Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0A0A0A] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden pointer-events-auto"
              >
                {/* Drawer Content Wrapper to handle height/overflow better */}
                <div className="flex flex-col h-full h-[100dvh]">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold tracking-tighter shrink-0">
                      ayushpaul<span className="text-brand-primary">.in</span>
                    </Link>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg active:scale-90"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Drawer Links */}
                  <div className="flex-1 overflow-y-auto py-8 px-6 space-y-4">
                    {navLinks.map((link, i) => (
                      <motion.button
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        onClick={() => handleNavClick(link)}
                        className="text-2xl font-display font-bold text-left text-white/50 hover:text-brand-primary transition-all group flex items-center justify-between w-full py-4 px-4 rounded-3xl hover:bg-white/5 active:scale-[0.98]"
                      >
                        {link.name}
                        <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </motion.button>
                    ))}
                  </div>

                  {/* Drawer Footer / Socials / CTA */}
                  <div className="p-8 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent shrink-0 space-y-8">
                    <div className="flex items-center justify-center gap-6">
                      {[
                        { icon: <Github size={20} />, href: "https://github.com/guchchi" },
                        { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/paulayush/" },
                        { icon: <Youtube size={20} />, href: "https://www.youtube.com/@ALX-17" }
                      ].map((social, i) => (
                        <a 
                          key={i} 
                          href={social.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-primary hover:bg-white/10 transition-all active:scale-95"
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (window.location.pathname !== '/') {
                          navigate('/');
                          setTimeout(() => {
                            document.getElementById('hire')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        } else {
                          document.getElementById('hire')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full py-5 bg-white text-black rounded-3xl font-bold text-lg hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl shadow-white/5"
                    >
                      Hire Me
                    </button>
                    <p className="text-center mt-6 text-[10px] font-bold uppercase tracking-widest text-white/20">Available for 2024–25 Projects</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
};
