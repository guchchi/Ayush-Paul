import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Youtube, Mail } from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { Container } from "@/src/components/ui/Container";

export const Footer = () => {
  return (
    <footer id="footer" className="layout-section border-t border-white/5 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      
      <Container>
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <Link to="/" className="text-3xl font-display font-bold tracking-tighter block group">
              ayushpaul<span className="text-brand-primary group-hover:neon-glow-blue transition-all">.in</span>
            </Link>
            <p className="text-white/40 text-lg max-w-sm leading-relaxed">
              Student entrepreneur and innovator crafting the future of AI and Robotics. Building products that solve real-world problems.
            </p>
            <div className="flex items-center gap-6">
              {[
                { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/paulayush/", hoverColor: "hover:text-blue-700 hover:bg-blue-700/10 hover:border-blue-700/20" },
                { icon: <Github size={24} />, href: "https://github.com/guchchi/", hoverColor: "hover:text-green-500 hover:bg-green-500/10 hover:border-green-500/20" },
                { icon: <Youtube size={24} />, href: "https://www.youtube.com/@ALX-17", hoverColor: "hover:text-red-600 hover:bg-red-600/10 hover:border-red-600/20" },
                { icon: <Mail size={24} />, href: "mailto:contact@ayushpaul.in", hoverColor: "hover:text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/20" }
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 transition-all border border-white/5", item.hoverColor)}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/#home" },
                { name: "Projects", href: "/projects" },
                { name: "Blog", href: "/blog" },
                { name: "Achievements", href: "/#achievements" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("/#") ? (
                    <button 
                      onClick={() => {
                        const id = link.href.split("#")[1];
                        if (window.location.pathname !== '/') {
                          window.location.href = link.href;
                        } else {
                          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-white/40 hover:text-brand-primary transition-colors font-medium text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link to={link.href} className="text-white/40 hover:text-brand-primary transition-colors font-medium">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Legal</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/privacy" className="text-white/40 hover:text-white transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/40 hover:text-white transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-white/40 hover:text-white transition-colors font-medium">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-sm font-medium">
            © 2026 Ayush Paul. Built independently in India.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-white/20 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Status: Operational
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
